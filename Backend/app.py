from flask import Flask, jsonify, request
from googleapiclient.discovery import build
from dotenv import load_dotenv
import os
from flask_cors import CORS  # Import CORS
import pandas as pd
from textblob import TextBlob
from pymongo import MongoClient
import googleapiclient.discovery
import ssl
from google.auth.transport.requests import Request

# Create an SSL context to explicitly use the correct protocol
ssl_context = ssl.create_default_context()
ssl_context.options |= ssl.OP_NO_TLSv1 | ssl.OP_NO_TLSv1_1  # Optional: Disable older protocols if needed

# Create a transport with the SSL context
http = Request()
http.ssl_context = ssl_context

# Initialize the YouTube API client with the SSL-enabled HTTP transport

app = Flask(__name__)
load_dotenv()
# Creating the Service
# youtube = build("youtube","v3",developerKey = os.getenv('API_KEY'))
# youtube = googleapiclient.discovery.build('youtube', 'v3',developerKey=os.getenv('API_KEY'), http=http)

import googleapiclient.discovery
import os
from google.auth.credentials import Credentials
from google.auth.transport.requests import Request

import os
import googleapiclient.discovery
import google.auth.transport.requests
import requests
import ssl
import os
import googleapiclient.discovery
import requests
import ssl
from google.auth import default
from google.auth.transport.requests import AuthorizedSession
# Step 1: Create a custom SSL context if needed

# print(os.getenv('API_KEY'))


# Step 5: Build the YouTube client using the authorized session
youtube = googleapiclient.discovery.build('youtube', 'v3', developerKey=os.getenv('API_KEY'))
# youtube = googleapiclient.discovery.build('youtube', 'v3', developerKey='AIzaSyAh8NuvaqOpDq7FQ5cjni_ESCQItKRiOI4')

CORS(app, resources={r"/*": {"origins": "https://tube-metric-full-stack.vercel.app"}})
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})



MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)  # Replace with your MongoDB URI
db = client["youtubeDatabase"]
collection = db["youtubeData"]


@app.route('/')
def home():
    return "Welcome to the Tube Metrics API!"

@app.route('/api/save-youtube-data', methods=['POST'])
def save_youtube_data():
    try:
        request_data = request.get_json()
        youtube_id = request_data.get('youtubeId')
        email = request_data.get('email')

        if not youtube_id or not email:
            return jsonify({"error": "youtubeId and email are required"}), 400

        # Update the existing document or insert a new one if it doesn't exist
        result = collection.update_one(
            {"email": email},  # Filter to find the document with this email
            {"$set": {"youtubeId": youtube_id}},  # Update the youtubeId field
            upsert=True  # Insert a new document if email doesn't exist
        )

        # Determine if an insert or update occurred
        if result.upserted_id:
            message = "New YouTube data saved successfully."
            inserted_id = str(result.upserted_id)
        else:
            message = "YouTube data updated successfully."
            inserted_id = None  # No new ID since it was an update

        return jsonify({
            "message": message,
            "id": inserted_id  # Return the ID only if a new document was inserted
        }), 200 if result.matched_count else 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    



@app.route('/api/save-api', methods=['POST'])
def save_api_key():
    try:
        request_data = request.get_json()
        api_key = request_data.get('apiKey')
        email = request_data.get('email')

        if not api_key or not email:
            return jsonify({"error": "youtubeId and email are required"}), 400

        # Update the existing document or insert a new one if it doesn't exist
        result = collection.update_one(
            {"email": email},  # Filter to find the document with this email
            {"$set": {"apiKey": api_key}},  # Update the youtubeId field
            upsert=True  # Insert a new document if email doesn't exist
        )

        # Determine if an insert or update occurred
        if result.upserted_id:
            message = "New API saved successfully."
            inserted_id = str(result.upserted_id)
        else:
            message = "YouTube API updated successfully."
            inserted_id = None  # No new ID since it was an update

        return jsonify({
            "message": message,
            "id": inserted_id  # Return the ID only if a new document was inserted
        }), 200 if result.matched_count else 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/get-youtube-id', methods=['POST'])
def get_youtube_id():
    try:
        # Get the request data
        request_data = request.get_json()
        email = request_data.get('email')

        if not email:
            return jsonify({"error": "email is required"}), 400

        # Find the document with the matching email
        user_data = collection.find_one({"email": email})

        if user_data:
            # Return the youtubeId associated with the email
            return jsonify({"youtubeId": user_data.get("youtubeId"),"apiKey": user_data.get("apiKey", None)}), 200
        else:
            # Return an error message if no data found for the email
            return jsonify({"message": "No data found for the provided email"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

import requests
import os

import requests
import os

def get_channel_details(channel_id=None,api = None):
    if not channel_id:
        return {"error": "Channel ID is required"}, 400  # Return an error if channel_id is None
    
    url = "https://www.googleapis.com/youtube/v3/channels"
    params = {
        'part': 'snippet,contentDetails,statistics',
        'id': channel_id,
        'key': api if api is not None else os.getenv('API_KEY')
    }

    try:
        # Make the API request with SSL verification disabled
        # response = requests.get(url, params=params, verify=False)
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
        
        response_data = response.json()
        # Check if the response contains any items
        if not response_data['items']:
            return {"error": "Channel not found"}, 404

        data = {
            "title": response_data['items'][0]['snippet']['title'],
            "description": response_data['items'][0]['snippet']['description'],
            "country": response_data['items'][0]['snippet'].get('country', 'N/A'),  # Avoid KeyError
            "viewCount": response_data['items'][0]['statistics']['viewCount'],
            "subscriberCount": response_data['items'][0]['statistics']['subscriberCount'],
            "videoCount": response_data['items'][0]['statistics']['videoCount'],
            "all_videos_playlist": response_data['items'][0]['contentDetails']['relatedPlaylists']['uploads'],
            "thumbnail": response_data['items'][0]['snippet']['thumbnails'].get('default', {}).get('url', 'N/A')  # Default to 'N/A' if not found
        }
        return data

    except requests.exceptions.HTTPError as http_err:
        print("HTTP error occurred:", http_err)
        return {"error": str(http_err)}, 500
    except requests.exceptions.SSLError as ssl_err:
        print("SSL Error: for dame!!!!!!!!!!!!!", ssl_err)
        return {"error": "SSL Error"}, 500
    except Exception as e:
        print("An error occurred:", e)
        return {"error": str(e)}, 500





# @app.route('/api/channel/<channel_id>', methods=['GET'])
# def channel_details(channel_id):
#     try:
#         details = get_channel_details(youtube, channel_id)
#         return jsonify(details)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    

# @app.route('/api/channel/<channel_id>', methods=['GET'])
# def channel_details(channel_id):
#     try:
#         # Get channel details
#         details = get_channel_details(channel_id)
#         # Assuming you have a way to retrieve the playlist ID associated with the channel
#         # This might be a specific playlist ID where the channel's videos are stored
#         # For example, the uploads playlist ID:
#         uploads_playlist_id = details['all_videos_playlist']  # Adjust based on your data structure
#         # Get video IDs from the uploads playlist
#         video_ids = get_video_ids_from_playlist( uploads_playlist_id,True)
#         # Get video details using the retrieved video IDs
#         video_details = get_video_details_from_videoIds( videoIds=video_ids)
#         # Combine channel details with video details
#         response_data = {
#             'channel_details': details,
#             'video_ids': video_ids,
#             'video_details': video_details
#         }

#         return jsonify(response_data)

#     except Exception as e:
#         print("Error from videoIds...............",e)
#         return jsonify({"error": str(e)}), 500


@app.route('/api/channel/<channel_id>', methods=['POST'])
def channel_details(channel_id):
    try:
        # Get channel details
        request_data = request.get_json()
        api = request_data.get('apiKey',None)
        details = get_channel_details(channel_id,api=api)
        # print("details....",details)
        # print("details....",type(details))
        # print("I AM HERE........")
        # Check if channel details contain the necessary key
        uploads_playlist_id = details.get('all_videos_playlist')
        if not uploads_playlist_id:
            return jsonify({"error": "Uploads playlist ID not found in channel details"}), 404

        # Get video IDs from the uploads playlist
        video_ids = get_video_ids_from_playlist(uploads_playlist_id, helper=True,api = api)
        if isinstance(video_ids, tuple) and video_ids[1] == 500:
            return video_ids  # Propagate the error if it is a 500 response

        # Get video details using the retrieved video IDs
        video_details = get_video_details_from_videoIds(videoIds=video_ids,api=api)

        # Combine channel details with video details
        response_data = {
            'channel_details': details,
            'video_ids': video_ids,
            'video_details': video_details
        }

        # print("LENGTH.....CHANNEL_DETAILS...",len(details))
        # print("LENGTH.....video_ids...",len(video_ids))
        # print("LENGTH.....video_details...",len(video_details))

        return jsonify(response_data), 200

    except Exception as e:
        print("Error from channel:", e)
        return jsonify({"error": str(e)}), 500
    





# For getting video related information
# from flask import request, jsonify

# @app.route('/api/videos/get-videos-ids/<playlistId>', methods=['GET'])
# def get_video_ids_from_playlist(playlistId,helper = False):
#     try:
#         # Validate the input
#         if not playlistId:
#             return jsonify({"error": "playlistId is required"}), 400

#         # YouTube API request to get videos from the playlist
#         request_youtube = youtube.playlistItems().list(
#             part='contentDetails',
#             playlistId=playlistId,
#             maxResults=5
#         )
#         response = request_youtube.execute()

#         video_ids = []
#         for i in response['items']:
#             video_ids.append(i['contentDetails']['videoId'])

#         next_page_token = response.get('nextPageToken')
#         while next_page_token is not None and len(video_ids) <= 20:
#             request_youtube = youtube.playlistItems().list(
#                 part='contentDetails',
#                 playlistId=playlistId,
#                 maxResults=5,
#                 pageToken=next_page_token
#             )
#             response = request_youtube.execute()

#             for i in response['items']:
#                 video_ids.append(i['contentDetails']['videoId'])

#             next_page_token = response.get('nextPageToken')
#         if(helper == False):
#             return jsonify(video_ids), 200
#         return video_ids

#     except Exception as e:
#         print("Error from videoIds...",e)
#         return jsonify({"error": str(e)}), 500


# Testing the SSL connections--------------------------->
# import requests

# url = "https://www.googleapis.com/youtube/v3/playlistItems"
# params = {
#     'part': 'contentDetails',
#     'playlistId': 'UUuaFvcY4MhZY3U43mMt1dYQ',
#     'maxResults': 5,
#     'key': os.getenv('API_KEY')
# }

# try:
#     response = requests.get(url, params=params)
#     response.raise_for_status()
#     print("Connection successful:", response.json())
# except requests.exceptions.SSLError as ssl_err:
#     print("SSL Error:", ssl_err)


# url = f'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&key=${apiKey}';

# Testing over------------------------------>

@app.route('/api/videos/get-videos-ids/<playlistId>', methods=['POST'])
def get_video_ids_from_playlist_route(playlistId):
    request_data = request.get_json()
    api = request_data.get('apiKey',None)
    return get_video_ids_from_playlist(playlistId,api = api)


# Uncomment for usage
# def get_video_ids_from_playlist(playlistId, helper=False):
#     try:
#         # Validate the input
#         if not playlistId:
#             return jsonify({"error": "playlistId is required"}), 400
        
#         # YouTube Data API URL
#         url = "https://www.googleapis.com/youtube/v3/playlistItems"
#         params = {
#             'part': 'contentDetails',
#             'playlistId': playlistId,
#             # 'maxResults': 5,
#             'maxResults': 50,
#             'key': os.getenv('API_KEY')
#         }

#         # Make the API request
#         # response = requests.get(url, params=params)
#         # response = requests.get(url, params=params, verify=False)
#         response = requests.get(url, params=params)

#         response.raise_for_status()  # Raises an HTTPError for bad responses (4xx and 5xx)
        
#         # Process the response
#         video_ids = [item['contentDetails']['videoId'] for item in response.json().get('items', [])]
        
#         # print(response)

#         # # this is it
#         # next_page_token = response.get('nextPageToken')
#         # # print('next_page_token.....',next_page_token)
#         # while next_page_token is not None:
            
#         #     request = youtube.playlistItems().list(
#         #         part='contentDetails',
#         #         playlistId = playlistId,
#         #         maxResults=50,
#         #         pageToken=next_page_token
#         #     )
#         #     response = request.execute()
#         #     for i in response['items']:
#         #         video_ids.append(i['contentDetails']['videoId'])
#         #     next_page_token = response.get('nextPageToken')


        
#         # if not helper:
#         #     return jsonify(video_ids), 200
        
#         return video_ids

#     except requests.exceptions.SSLError as ssl_err:
#         print("SSL Error:", ssl_err)
#         return jsonify({"error": "SSL error occurred", "details": str(ssl_err)}), 500
#     except requests.exceptions.RequestException as e:
#         print("Request Error:", e)
#         return jsonify({"error": str(e)}), 500
#     except Exception as e:
#         print("General Error:", e)
#         return jsonify({"error": str(e)}), 500



def get_video_ids_from_playlist(playlistId, helper=False,api = None):
    try:
        # Validate the input
        if not playlistId:
            return jsonify({"error": "playlistId is required"}), 400
        
        # YouTube Data API URL
        url = "https://www.googleapis.com/youtube/v3/playlistItems"
        params = {
            'part': 'contentDetails',
            'playlistId': playlistId,
            # 'maxResults': 5,
            'maxResults': 50,
            # 'key': os.getenv('API_KEY')
            'key': api if api is not None else os.getenv('API_KEY')

        }

        # Make the API request
        # response = requests.get(url, params=params)
        # response = requests.get(url, params=params, verify=False)
        response = requests.get(url, params=params)
        # print("RESPONSE.....",type(response.json()))
        # print("RESPONSE.....",response.json()['nextPageToken'])
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx and 5xx)
        
        # Process the response
        video_ids = [item['contentDetails']['videoId'] for item in response.json().get('items', [])]
        
        return video_ids

        next_page_token = response.json()['nextPageToken']
        print("the next page token...",next_page_token)
        while next_page_token is not None:
        
            request = youtube.playlistItems().list(
                part='contentDetails',
                playlistId = playlistId,
                maxResults=50,
                pageToken=next_page_token
            )
            response = request.execute()
            for i in response['items']:
                video_ids.append(i['contentDetails']['videoId'])
            next_page_token = response.get('nextPageToken')
        return video_ids

    except requests.exceptions.SSLError as ssl_err:
        print("SSL Error:", ssl_err)
        return jsonify({"error": "SSL error occurred", "details": str(ssl_err)}), 500
    except requests.exceptions.RequestException as e:
        print("Request Error:", e)
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print("General Error:", e)
        return jsonify({"error": str(e)}), 500



# @app.route('/api/videos/get-videos-details', methods=['POST'])
# def get_video_details_from_videoIds(videoIds=None, playlist_id=None, max=0):
#     all_data = []

#     # If videoIds is None, fetch video IDs from the playlist
#     if videoIds is None:
#         if not playlist_id:
#             return {"error": "playlist_id is required when videoIds is None"}, 400
        
#         url = "https://www.googleapis.com/youtube/v3/playlistItems"
#         params = {
#             'part': 'contentDetails',
#             'playlistId': playlist_id,
#             # 'maxResults': max if max != 0 else 10,
#             'maxResults': max if max != 0 else 50,
#             'key': os.getenv('API_KEY')
#         }
        
#         try:
#             # response = requests.get(url, params=params, verify=False)  # Disable SSL verification if necessary
#             response = requests.get(url, params=params)  # Disable SSL verification if necessary
#             response.raise_for_status()  # Raise an error for bad responses
#             response_data = response.json()
            
#             # Extract the video IDs from the response
#             for item in response_data.get('items', []):
#                 video_id = item['contentDetails']['videoId']
#                 all_data.append(video_id)
#             videoIds = all_data
#             all_data = []

        
        
#         except requests.exceptions.HTTPError as http_err:
#             print("HTTP error occurred while fetching video IDs:", http_err)
#             return {"error": "Failed to fetch video IDs from playlist"}, 500
#         except requests.exceptions.SSLError as ssl_err:
#             print("SSL Error:", ssl_err)
#             return {"error": "SSL Error"}, 500
#         except Exception as e:
#             print("An error occurred:", e)
#             return {"error": str(e)}, 500

#     # Fetch video details in batches of 50
#     for i in range(0, len(videoIds), 50):
#         if len(all_data) >= max and max > 0:
#             break
        
#         # Ensure all IDs are strings and create a batch of 50
#         batch_video_ids = [str(video_id) for video_id in videoIds[i:i + 50]]
#         url = "https://www.googleapis.com/youtube/v3/videos"
#         params = {
#             'part': 'statistics,contentDetails,snippet,id',
#             'id': ','.join(batch_video_ids),
#             'key': os.getenv('API_KEY')
#         }
#         all_data = []
#         try:
#             # response = requests.get(url, params=params, verify=False)  # Disable SSL verification if necessary
#             response = requests.get(url, params=params)  # Disable SSL verification if necessary
#             response.raise_for_status()  # Raise an error for bad responses
#             response_data = response.json()

#             for video in response_data.get('items', []):
#                 data_dict = {
#                     "duration": video['contentDetails']['duration'],
#                     "viewCount": video['statistics'].get('viewCount'),
#                     "likeCount": video['statistics'].get('likeCount'),
#                     "commentCount": video['statistics'].get('commentCount'),
#                     "publishedAt": video['snippet']['publishedAt'],
#                     "title": video['snippet']['title'],
#                     "description": video['snippet']['description'],
#                     "tags": video['snippet'].get('tags'),
#                     "video_id": video['id'],
#                 }
#                 all_data.append(data_dict)

#         except requests.exceptions.HTTPError as http_err:
#             print("HTTP error occurred while fetching video details:", http_err)
#             return {"error": "Failed to fetch video details"}, 500
#         except requests.exceptions.SSLError as ssl_err:
#             print("SSL Error:", ssl_err)
#             return {"error": "SSL Error"}, 500
#         except Exception as e:
#             print("An error occurred:", e)
#             return {"error": str(e)}, 500

#     return all_data








def get_video_details_from_videoIds(videoIds=None, playlist_id=None, max=0,api = None):
    all_data = []

    # If videoIds is None, fetch video IDs from the playlist
    if videoIds is None:
        if not playlist_id:
            return {"error": "playlist_id is required when videoIds is None"}, 400
        
        url = "https://www.googleapis.com/youtube/v3/playlistItems"
        params = {
            'part': 'contentDetails',
            'playlistId': playlist_id,
            'maxResults': 50,
            # 'key': os.getenv('API_KEY')
            'key': api if api is not None else os.getenv('API_KEY')

        }
        
        try:
            videoIds = get_video_ids_from_playlist(playlist_id,api = api)
            print("VIDEOIDS.........",len(videoIds))
            all_data = []

        
        
        except requests.exceptions.HTTPError as http_err:
            print("HTTP error occurred while fetching video IDs:", http_err)
            return {"error": "Failed to fetch video IDs from playlist"}, 500
        except requests.exceptions.SSLError as ssl_err:
            print("SSL Error:", ssl_err)
            return {"error": "SSL Error"}, 500
        except Exception as e:
            print("An error occurred:", e)
            return {"error": str(e)}, 500

    # Fetch video details in batches of 50
    print("the length of the video ids...",len(videoIds))
    all_data = []
    for i in range(0, len(videoIds), 50):
        
        # Ensure all IDs are strings and create a batch of 50
        batch_video_ids = [str(video_id) for video_id in videoIds[i:i + 50]]
        url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            'part': 'statistics,contentDetails,snippet,id',
            'id': ','.join(batch_video_ids),
            # 'key': os.getenv('API_KEY')
        'key': api if api is not None else os.getenv('API_KEY')

        }
        try:
            # response = requests.get(url, params=params, verify=False)  # Disable SSL verification if necessary
            response = requests.get(url, params=params)  # Disable SSL verification if necessary
            response.raise_for_status()  # Raise an error for bad responses
            response_data = response.json()

            for video in response_data.get('items', []):
                data_dict = {
                    "duration": video['contentDetails']['duration'],
                    "viewCount": video['statistics'].get('viewCount'),
                    "likeCount": video['statistics'].get('likeCount'),
                    "commentCount": video['statistics'].get('commentCount'),
                    "publishedAt": video['snippet']['publishedAt'],
                    "title": video['snippet']['title'],
                    "description": video['snippet']['description'],
                    "tags": video['snippet'].get('tags'),
                    "video_id": video['id'],
                }
                all_data.append(data_dict)

        except requests.exceptions.HTTPError as http_err:
            print("HTTP error occurred while fetching video details:", http_err)
            return {"error": "Failed to fetch video details"}, 500
        except requests.exceptions.SSLError as ssl_err:
            print("SSL Error:", ssl_err)
            return {"error": "SSL Error"}, 500
        except Exception as e:
            print("An error occurred:", e)
            return {"error": str(e)}, 500
    print("LENGTH INSIDE VIDEO DETAILS FROM VIDEO IDS...",len(all_data))
    return all_data



# app = Flask(__name__)



# Data frame formatter
def format_timedelta(duration):
    # Convert the duration string (ISO 8601) to a timedelta object
    if isinstance(duration, str):
        duration = pd.to_timedelta(duration)  # Converts ISO 8601 format to timedelta

    # Check if the duration is less than 1 day
    if duration.days == 0:
        # Format as "HH:MM:SS" if it's less than 1 day
        return str(duration).split(' days ')[-1]
    else:
        # Keep the full format if it has more than 1 day
        return str(duration)

def dataFrameOfVideosFormatter(df):
    # Convert 'publishedAt' to datetime
    df['publishedAt'] = pd.to_datetime(df['publishedAt'], errors='coerce')

    # Handle timezone by converting to UTC if necessary
    if df['publishedAt'].dt.tz is not None:
        df['publishedAt'] = df['publishedAt'].dt.tz_convert('UTC').dt.tz_localize(None)  # Drop timezone

    # Create 'date' and 'month' columns
    df['date'] = df['publishedAt'].dt.date
    df['month'] = df['publishedAt'].dt.strftime('%B')

    # Convert numeric columns with error handling
    df['viewCount'] = pd.to_numeric(df['viewCount'], errors='coerce')
    df['likeCount'] = pd.to_numeric(df['likeCount'], errors='coerce')
    df['commentCount'] = pd.to_numeric(df['commentCount'], errors='coerce')

    # Format the 'duration' column
    # df['duration_formatted'] = df['duration'].apply(format_timedelta)
    # # Assuming df['duration'] is in timedelta format
    # df['duration'] = pd.to_timedelta(df['duration'])
    # # Convert the 'duration' column to seconds
    # df['duration_seconds'] = df['duration'].apply(lambda x: x.total_seconds())
    # Display the updated DataFrame to verify
    return df

# To get the top N videos in terms of views
@app.route('/api/videos/top-n-videos-views', methods=['POST'])
def topNVideosGraphOfTitleVsViewsBarGraph():
    try:
        
        # Get data from the request body
        request_data = request.get_json()
        videoIds = request_data.get('videoIds', None)  # Default to None if not provided
        top_values = request_data.get('top_values', 10)  # Default to 10 if not provided

        # Validate the input
        if not videoIds:
            return jsonify({"error": "videoIds are required"}), 400
        # Dataframe creation
        request_data = request.get_json()
        api = request_data.get('apiKey',None)
        videosData = get_video_details_from_videoIds(videoIds,api = api)
        df = pd.DataFrame(videosData)
        df_videos_formatted = dataFrameOfVideosFormatter(df)
        print("LENGTH OF VIDEOSDATA...",len(videosData))
        # Get the top N videos sorted by view count
        top_n_values_view_wise = df_videos_formatted.sort_values(by='viewCount', ascending=False).head(top_values)

        # Convert the DataFrame to a JSON format for the response
        top_n_json = top_n_values_view_wise.to_dict(orient='records')

        return jsonify(top_n_json)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    # return jsonify()
    # # Create the bar plot
    # plt.figure(figsize=(10, 6))  # Set figure size for better readability
    # sns.barplot(x='viewCount', y='title', data=top_10_values_view_wise, palette='viridis')

    # # Adding titles and labels
    # plt.title(f'Top {top_values} Videos by View Count', fontsize=16)
    # plt.xlabel('View Count', fontsize=12)
    # plt.ylabel('Video Title', fontsize=12)

    # # Show the plot
    # plt.show()


# Uncomment this 
# @app.route('/api/videos/get-videos-details-from-playlistId', methods=['POST'])
# def get_video_details_from_playlistId():
#     all_data = []
#     try:
#         # Fetch request data
#         request_data = request.get_json()  # Ensure this uses the correct Flask request object
#         playlistId = request_data.get('playlistId') 
#         # max_results = request_data.get('max', 10) 
#         max_results = request_data.get('max', 50) 

#         # Check if playlistId is provided
#         if not playlistId:
#             return jsonify({"error": "playlistId is required"}), 400

#         # Fetch video IDs from the playlist
#         url = "https://www.googleapis.com/youtube/v3/playlistItems"
#         params = {
#             'part': 'contentDetails',
#             'playlistId': playlistId,
#             'maxResults': max_results,
#             'key': os.getenv('API_KEY')
#         }
        
#         try:
#             # response = requests.get(url, params=params, verify=False)  # Disable SSL verification if necessary
#             response = requests.get(url, params=params)  # Disable SSL verification if necessary
#             response.raise_for_status()  # Raise an error for bad responses
#             response_data = response.json()

#             # Extract video IDs
#             videos = [item['contentDetails']['videoId'] for item in response_data.get('items', [])]

#         except requests.exceptions.HTTPError as http_err:
#             print("HTTP error occurred while fetching video IDs:", http_err)
#             return jsonify({"error": "Failed to fetch video IDs from playlist"}), 500
#         except requests.exceptions.SSLError as ssl_err:
#             print("SSL Error:", ssl_err)
#             return jsonify({"error": "SSL Error"}), 500
#         except Exception as e:
#             print("An error occurred:", e)
#             return jsonify({"error": str(e)}), 500

#         # Fetch video details in batches of 50
#         for i in range(0, len(videos), 50):
#             # if len(all_data) >= max_results and max_results > 0:
#             #     break
            
#             # Create a batch of video IDs
#             batch_video_ids = [str(video_id) for video_id in videos[i:i + 50]]
#             url = "https://www.googleapis.com/youtube/v3/videos"
#             params = {
#                 'part': 'statistics,contentDetails,snippet',
#                 'id': ','.join(batch_video_ids),
#                 'key': os.getenv('API_KEY')
#             }

#             try:
#                 # video_response = requests.get(url, params=params, verify=False)  # Disable SSL verification if necessary
#                 video_response = requests.get(url, params=params)  # Disable SSL verification if necessary
#                 video_response.raise_for_status()  # Raise an error for bad responses
#                 video_data = video_response.json()

#                 for video in video_data.get('items', []):
#                     data_dict = {
#                         "duration": video['contentDetails']['duration'],
#                         "viewCount": video['statistics'].get('viewCount'),
#                         "likeCount": video['statistics'].get('likeCount'),
#                         "commentCount": video['statistics'].get('commentCount'),
#                         "publishedAt": video['snippet']['publishedAt'],
#                         "title": video['snippet']['title'],
#                         "description": video['snippet']['description'],
#                         "tags": video['snippet'].get('tags', []),  # Provide default empty list
#                         "video_id": video['id'],
#                         "thumbnails": video['snippet']['thumbnails']
#                     }
#                     all_data.append(data_dict)

#             except requests.exceptions.HTTPError as http_err:
#                 print("HTTP error occurred while fetching video details:", http_err)
#                 return jsonify({"error": "Failed to fetch video details"}), 500
#             except requests.exceptions.SSLError as ssl_err:
#                 print("SSL Error:", ssl_err)
#                 return jsonify({"error": "SSL Error"}), 500
#             except Exception as e:
#                 print("An error occurred:", e)
#                 return jsonify({"error": str(e)}), 500
#         print(len(all_data))
#         # Return a dictionary with the key 'videoData'
#         return jsonify({"videoData": all_data})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500




@app.route('/api/videos/get-videos-details-from-playlistId', methods=['POST'])
def get_video_details_from_playlistId(api = None):
    all_data = []
    try:
        # Fetch request data
        request_data = request.get_json()  # Ensure this uses the correct Flask request object
        playlistId = request_data.get('playlistId') 
        # max_results = request_data.get('max', 10) 
        max_results = request_data.get('max', 50) 

        # Check if playlistId is provided
        if not playlistId:
            return jsonify({"error": "playlistId is required"}), 400

        # Fetch video IDs from the playlist
        url = "https://www.googleapis.com/youtube/v3/playlistItems"
        params = {
            'part': 'contentDetails',
            'playlistId': playlistId,
            'maxResults': 50,
            # 'key': os.getenv('API_KEY')
        'key': api if api is not None else os.getenv('API_KEY')

        }
        
        try:
            request_data = request.get_json()
            api = request_data.get('apiKey',None)
            videos = get_video_ids_from_playlist(playlistId,api = api)



        except requests.exceptions.HTTPError as http_err:
            print("HTTP error occurred while fetching video IDs:", http_err)
            return jsonify({"error": "Failed to fetch video IDs from playlist"}), 500
        except requests.exceptions.SSLError as ssl_err:
            print("SSL Error:", ssl_err)
            return jsonify({"error": "SSL Error"}), 500
        except Exception as e:
            print("An error occurred:", e)
            return jsonify({"error": str(e)}), 500

        # Fetch video details in batches of 50
        for i in range(0, len(videos), 50):
            # if len(all_data) >= max_results and max_results > 0:
            #     break
            
            # Create a batch of video IDs
            batch_video_ids = [str(video_id) for video_id in videos[i:i + 50]]
            url = "https://www.googleapis.com/youtube/v3/videos"
            params = {
                'part': 'statistics,contentDetails,snippet',
                'id': ','.join(batch_video_ids),
                # 'key': os.getenv('API_KEY')
            'key': api if api is not None else os.getenv('API_KEY')

            }

            try:
                # video_response = requests.get(url, params=params, verify=False)  # Disable SSL verification if necessary
                video_response = requests.get(url, params=params)  # Disable SSL verification if necessary
                video_response.raise_for_status()  # Raise an error for bad responses
                video_data = video_response.json()

                for video in video_data.get('items', []):
                    data_dict = {
                        "duration": video['contentDetails']['duration'],
                        "viewCount": video['statistics'].get('viewCount'),
                        "likeCount": video['statistics'].get('likeCount'),
                        "commentCount": video['statistics'].get('commentCount'),
                        "publishedAt": video['snippet']['publishedAt'],
                        "title": video['snippet']['title'],
                        "description": video['snippet']['description'],
                        "tags": video['snippet'].get('tags', []),  # Provide default empty list
                        "video_id": video['id'],
                        "thumbnails": video['snippet']['thumbnails']
                    }
                    all_data.append(data_dict)

            except requests.exceptions.HTTPError as http_err:
                print("HTTP error occurred while fetching video details:", http_err)
                return jsonify({"error": "Failed to fetch video details"}), 500
            except requests.exceptions.SSLError as ssl_err:
                print("SSL Error:", ssl_err)
                return jsonify({"error": "SSL Error"}), 500
            except Exception as e:
                print("An error occurred:", e)
                return jsonify({"error": str(e)}), 500
        print("THE LENGTH....",len(all_data))
        # Return a dictionary with the key 'videoData'
        return jsonify({"videoData": all_data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500






@app.route('/api/videos/top-n-videos-likes', methods=['POST'])
def topNVideosGraphOfTitleVsLikesBarGraph():
    try:
        # Get data from the request body
        request_data = request.get_json()
        videoIds = request_data.get('videoIds', None)  # Default to None if not provided
        top_values = request_data.get('top_values', 10)  # Default to 10 if not provided

        # Validate the input
        if not videoIds:
            return jsonify({"error": "videoIds are required"}), 400

        # Dataframe creation
        request_data = request.get_json()
        api = request_data.get('apiKey',None)
        videosData = get_video_details_from_videoIds(videoIds,api = api)
        # print("LENGTH...",len(videosData))
        df = pd.DataFrame(videosData)
        df_videos_formatted = dataFrameOfVideosFormatter(df)




        # Get the top N videos sorted by like count
        top_n_values_like_wise = df_videos_formatted.sort_values(by='likeCount', ascending=False).head(top_values)
        # top_n_values_like_wise = df_videos_formatted.sort_values(by='likeCount', ascending=False)

        # Convert the DataFrame to a JSON format for the response
        top_n_json = top_n_values_like_wise.to_dict(orient='records')

        return jsonify(top_n_json)
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/api/videos/top-n-commented-videos', methods=['POST'])
def topNMostCommentedVideos():
    try:
        # Get data from the request body
        request_data = request.get_json()
        videoIds = request_data.get('videoIds', None)  # Get video IDs from the request
        top_values = request_data.get('top_values', 10)  # Default to 10 if not provided

        # Validate input
        if not videoIds:
            return jsonify({"error": "videoIds are required"}), 400

        # Fetch video details based on videoIds (assumed function)
        request_data = request.get_json()
        api = request_data.get('apiKey',None)
        videosData = get_video_details_from_videoIds(videoIds,api = api)
        print("the length commented...",len(videosData))
        df = pd.DataFrame(videosData)

        # Ensure 'commentCount' is numeric
        df['commentCount'] = pd.to_numeric(df['commentCount'], errors='coerce')
        df = df.dropna(subset=['commentCount'])  # Remove rows with NaN comment counts

        # Sort videos by 'commentCount' in descending order and select the top N most commented videos
        print(len(df))
        df_sorted = df.sort_values(by='commentCount', ascending=False).head(top_values)



        # Format the data into a JSON-friendly structure
        result = df_sorted[['title', 'commentCount']].to_dict(orient='records')

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



   

@app.route('/api/videos/views-vs-published', methods=['POST'])
def get_views_publishedTime():
    try:
        # Get data from the request body
        request_data = request.get_json()
        videoIds = request_data.get('videoIds', None)  # Get video IDs from the request
        top_values = request_data.get('top_values', 10)  # Default to 10 if not provided

        # Validate input
        if not videoIds:
            return jsonify({"error": "videoIds are required"}), 400

        # Fetch video details based on videoIds (assumed function)
        request_data = request.get_json()
        api = request_data.get('apiKey',None)
        videosData = get_video_details_from_videoIds(videoIds,api = api)
        # print("WHAT IS THE LENGTH...",len(videosData))
        df_videos = pd.DataFrame(videosData)
        df_videos = df_videos.sort_values('publishedAt',ascending=False)
        df1 = df_videos.head(top_values)
        df1 = df1.sort_values('publishedAt')
        result = df1[['publishedAt', 'viewCount']].to_dict(orient='records')
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/api/videos/views-vs-month', methods=['POST'])
def get_views_vs_month():
    try:
        # Get data from the request body
        request_data = request.get_json()
        videoIds = request_data.get('videoIds', None)  # Get video IDs from the request

        # Validate input
        if not videoIds:
            return jsonify({"error": "videoIds are required"}), 400

        # Fetch video details based on videoIds (assumed function)
        request_data = request.get_json()
        api = request_data.get('apiKey',None)
        videosData = get_video_details_from_videoIds(videoIds, api = api)
        df = pd.DataFrame(videosData)
        df = dataFrameOfVideosFormatter(df)

        # Group by month and sum up the views
        monthly_views = df.groupby('month')['viewCount'].sum().reset_index()

        # Sort by month for proper plotting
        monthly_views = monthly_views.sort_values('month')

        # Convert monthly_views to JSON-compatible format
        monthly_views_data = monthly_views.to_dict(orient='records')

        # Return only the list of dictionaries
        return jsonify(monthly_views_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



def get_comments(video_id, max_comments=10,api = None):
    try:
        comments = []
        url = "https://www.googleapis.com/youtube/v3/commentThreads"
        params = {
            'part': 'snippet',
            'videoId': video_id,
            'textFormat': 'plainText',
            'maxResults': 10,  # Limit the number of comments to fetch for analysis
            # 'key': os.getenv('API_KEY')/
        'key': api if api is not None else os.getenv('API_KEY')

        }

        # Initial request to fetch comments
        # response = requests.get(url, params=params, verify=False)  # Disable SSL verification if necessary
        response = requests.get(url, params=params)  # Disable SSL verification if necessary
        response.raise_for_status()  # Raise an error for bad responses
        response_data = response.json()

        # Collect comments from the response
        for item in response_data.get('items', []):
            comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
            comments.append(comment)

        # Check for more comments (pagination)
        while 'nextPageToken' in response_data and len(comments) < max_comments:
            params['pageToken'] = response_data['nextPageToken']
            # response = requests.get(url, params=params, verify=False)  # Disable SSL verification if necessary
            response = requests.get(url, params=params)  # Disable SSL verification if necessary
            response.raise_for_status()  # Raise an error for bad responses
            response_data = response.json()
            
            for item in response_data.get('items', []):
                comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
                comments.append(comment)

            # Stop if we reach the maximum number of comments
            if len(comments) >= max_comments:
                break
        print("get_comments fine....................")
        return comments[:max_comments]  # Return only the max number of comments requested

    except requests.exceptions.HTTPError as http_err:
        print("HTTP error occurred while fetching comments:", http_err)
        return []
    except requests.exceptions.SSLError as ssl_err:
        print("SSL Error:", ssl_err)
        return []
    except Exception as e:
        print(f"Error fetching comments: {str(e)}")
        return []


def analyze_sentiment(comment):
    analysis = TextBlob(comment)
    if analysis.sentiment.polarity > 0:
        return 'Positive'
    elif analysis.sentiment.polarity < 0:
        return 'Negative'
    else:
        return 'Neutral'

# Function to get total count of each sentiment category for a video
def sentiment_summary(video_id,api = None):
    # Fetch comments for the given video ID

    comments = get_comments(video_id,api = api)
    # Create a DataFrame for storing comments and sentiments
    df = pd.DataFrame(comments, columns=['comment'])
    
    # Perform sentiment analysis and add a new 'sentiment' column
    df['sentiment'] = df['comment'].apply(analyze_sentiment)
    
    # Calculate the total counts for each sentiment
    sentiment_counts = df['sentiment'].value_counts()

    # Extract the counts for each sentiment, defaulting to 0 if not present
    total_positive = sentiment_counts.get('Positive', 0)
    total_negative = sentiment_counts.get('Negative', 0)
    total_neutral = sentiment_counts.get('Neutral', 0)
    
    # Return the sentiment counts as a dictionary
    return {
        'Positive': total_positive,
        'Negative': total_negative,
        'Neutral': total_neutral
    }

# Function to fetch comments for a list of video IDs and calculate sentiment percentages
import pandas as pd

def sentiment_summary_multiple_videos(video_ids,api = None):
    # Initialize counters for overall sentiment
    total_positive = 0
    total_negative = 0
    total_neutral = 0
    total_comments = 0

    # Loop through each video ID
    for video_id in video_ids:
        # Fetch comments for the given video ID
        comments = get_comments(video_id,api = api)

        # Create a DataFrame to store the comments
        df = pd.DataFrame(comments, columns=['comment'])

        # Perform sentiment analysis on each comment
        df['sentiment'] = df['comment'].apply(analyze_sentiment)

        # Calculate the total counts for each sentiment
        sentiment_counts = df['sentiment'].value_counts()

        # Update overall counters
        total_positive += sentiment_counts.get('Positive', 0)
        total_negative += sentiment_counts.get('Negative', 0)
        total_neutral += sentiment_counts.get('Neutral', 0)

        # Update total comments count
        total_comments += len(df)

    # Calculate percentage of positive, negative, and neutral comments
    positive_percentage = (total_positive / total_comments) * 100 if total_comments > 0 else 0
    negative_percentage = (total_negative / total_comments) * 100 if total_comments > 0 else 0
    neutral_percentage = (total_neutral / total_comments) * 100 if total_comments > 0 else 0

    # Create a summary DataFrame
    sentiment_summary = {
        'Positive Percentage': positive_percentage,
        'Negative Percentage': negative_percentage,
        'Neutral Percentage': neutral_percentage
    }

    return sentiment_summary


from flask import jsonify, request
import pandas as pd
import math  # Import math for ceiling function

@app.route('/api/videos/positive-sentiment-ratio', methods=['POST'])
def positive_sentiment_ratio_of_video_ids():
    try:
        request_data = request.get_json()
        api = request_data.get('apiKey',None)
        # Get data from the request body
        request_data = request.get_json()
        videoIds = request_data.get('videoIds', None)  # Get video IDs from the request

        if videoIds is None:
            return jsonify({"error": "videoIds are required"}), 400

        # Initialize a dictionary to store positive comment ratios for each video ID
        positive_comments_ratio = {}

        # Get comments for each video ID and analyze sentiment
        for video_id in videoIds:
            comments = get_comments(video_id,api = api)  # Fetch comments for the specific video ID
            df = pd.DataFrame(comments, columns=['comment'])

            # Perform sentiment analysis on each comment
            df['sentiment'] = df['comment'].apply(analyze_sentiment)

            # Count total and positive comments
            total_count = df.shape[0]
            positive_count = df[df['sentiment'] == 'Positive'].shape[0]  # Adjust sentiment label as necessary

            # Calculate the percentage of positive comments
            if total_count > 0:
                percentage = (positive_count / total_count) * 100  # Percentage of positive comments
                rounded_percentage = math.ceil(percentage)  # Round up the percentage
            else:
                rounded_percentage = 0  # No comments, set percentage to 0

            positive_comments_ratio[video_id] = rounded_percentage

        return jsonify(positive_comments_ratio)

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Function to plot the sentiment analysis results
@app.route('/api/videos/comments-sentiment', methods=['POST'])
def plot_sentiment_results():
    try:
        request_data = request.get_json()
        api = request_data.get('apiKey',None)
        # Get data from the request body
        request_data = request.get_json()
        videoIds = request_data.get('videoIds', None)  # Get video IDs from the request

        # Validate input
        if not videoIds:
            return jsonify({"error": "videoIds are required"}), 400

        # Fetch video details based on videoIds (assumed function)
        sorted_sentiment_df = sentiment_summary_multiple_videos(videoIds,api = api)
        return jsonify(sorted_sentiment_df), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500




import os
import requests

@app.route('/api/videos/get-channels-details', methods=['POST'])
def get_channels_details():
    # Get the JSON data from the request
    data = request.get_json()
    channel_ids = data.get('channel_ids', None)  # Extract channel_ids

    # Validate input
    if channel_ids is None or not isinstance(channel_ids, list):
        return jsonify({'error': 'Invalid input. Please provide a list of channel IDs.'}), 400

    all_data = []

    api = data.get('apiKey',None)
    try:
        # Make the API request to get channel details
        url = "https://www.googleapis.com/youtube/v3/channels"
        params = {
            'part': 'snippet,contentDetails,statistics',
            'id': ','.join(channel_ids),
        'key': api if api is not None else os.getenv('API_KEY')

        }

        # response = requests.get(url, params=params, verify=False)  # Disable SSL verification if necessary
        response = requests.get(url, params=params)  # Disable SSL verification if necessary
        response.raise_for_status()  # Raise an error for bad responses
        response_data = response.json()

        # Process the response
        for item in response_data.get('items', []):
            channel_data = {
                'id': item.get('id', ''),  # Corrected access
                'title': item['snippet'].get('title', ''),
                'description': item['snippet'].get('description', ''),
                'country': item['snippet'].get('country', ''),
                'viewCount': item['statistics'].get('viewCount', 0),
                'subscriberCount': item['statistics'].get('subscriberCount', 0),
                'videoCount': item['statistics'].get('videoCount', 0),
                'all_videos_playlist': item['contentDetails']['relatedPlaylists'].get('uploads', '')
            }
            all_data.append(channel_data)

        return jsonify(all_data), 200  # Return 200 OK with data

    except requests.exceptions.HTTPError as http_err:
        return jsonify({'error': f"HTTP error occurred: {str(http_err)}"}), 500
    except requests.exceptions.SSLError as ssl_err:
        return jsonify({'error': f"SSL error occurred: {str(ssl_err)}"}), 500
    except Exception as e:
        return jsonify({'error': f"Error occurred: {str(e)}"}), 500




def dataFrameFormatterForInformationDataFrame(df):
    df['viewCount'] = pd.to_numeric(df['viewCount'], errors='coerce')
    df['subscriberCount'] = pd.to_numeric(df['subscriberCount'], errors='coerce')
    df['videoCount'] = pd.to_numeric(df['videoCount'], errors='coerce')
    return df

@app.route('/api/videos/subscriber-channel', methods=['POST'])
def multiple_channel_subscriber_comparison_bar_chart():
    try:
        request_data = request.get_json()
        videoDetails = request_data.get('videoDetails', None)  # Get video IDs from the request
        # Validate input
        if not videoDetails:
            return jsonify({"error": "videoDetails are required"}), 400
        
        # Create a DataFrame from the video details
        df = pd.DataFrame(videoDetails)
        
        # Format the DataFrame using the existing function
        df = dataFrameFormatterForInformationDataFrame(df)
        
        # Select only the required columns for the response
        response_data = df[['subscriberCount', 'title']].to_dict(orient='records')  # Convert to a list of dictionaries

        # Return the response in JSON format
        return jsonify(response_data), 200

    except Exception as e:
        # Return the error message in the response
        return jsonify({"error": f"An error occurred while processing your request: {str(e)}"}), 500
@app.route('/api/videos/video-count-channel', methods=['POST'])
def multiple_channel_videoCount_comparison_bar_chart():
    try:
        request_data = request.get_json()
        videoDetails = request_data.get('videoDetails', None)  # Get video IDs from the request
        # Validate input
        if not videoDetails:
            return jsonify({"error": "videoDetails are required"}), 400
        
        # Create a DataFrame from the video details
        df = pd.DataFrame(videoDetails)
        
        # Format the DataFrame using the existing function
        df = dataFrameFormatterForInformationDataFrame(df)
        
        # Select only the required columns for the response
        response_data = df[['videoCount', 'title']].to_dict(orient='records')  # Convert to a list of dictionaries

        # Return the response in JSON format
        return jsonify(response_data), 200

    except Exception as e:
        # Return the error message in the response
        return jsonify({"error": f"An error occurred while processing your request: {str(e)}"}), 500
@app.route('/api/videos/view-count-channel', methods=['POST'])
def multiple_channel_viewCount_comparison_bar_chart():
    try:
        request_data = request.get_json()
        videoDetails = request_data.get('videoDetails', None)  # Get video IDs from the request
        # Validate input
        if not videoDetails:
            return jsonify({"error": "videoDetails are required"}), 400
        
        # Create a DataFrame from the video details
        df = pd.DataFrame(videoDetails)
        
        # Format the DataFrame using the existing function
        df = dataFrameFormatterForInformationDataFrame(df)
        
        # Select only the required columns for the response
        response_data = df[['viewCount', 'title']].to_dict(orient='records')  # Convert to a list of dictionaries

        # Return the response in JSON format
        return jsonify(response_data), 200

    except Exception as e:
        # Return the error message in the response
        return jsonify({"error": f"An error occurred while processing your request: {str(e)}"}), 500
    

# For storing the data corresponding to each of the videos of multiple channels.
video_cache = {}

@app.route('/api/videos/info-videos-playlists', methods=['POST'])
def info_videos_playlist():
    try:
        request_data = request.get_json()
        channelDetails = request_data.get('channelDetails', None)  # Get channel details from the request
        
        api = request_data.get('apiKey',None)

        # Validate input
        if not channelDetails:
            return jsonify({"error": "channelDetails are required"}), 400
        
        # Create a DataFrame from the channel details
        df = pd.DataFrame(channelDetails)
        
        # Format the DataFrame using the existing function
        df = dataFrameFormatterForInformationDataFrame(df)
        
        # Initialize a list to hold details for each channel
        channels_info = []

        # Loop over each row in the DataFrame to get channel title and playlist IDs
        for index, row in df.iterrows():
            channel_info = {
                "channel_title": row['title'],  # Adjust based on actual column name for channel title
                "videos": []
            }
        
            
            # Loop over each playlist_id in the 'all_videos_playlist' column
            # for playlist_id in row['all_videos_playlist']:
                # Check if the data is already cached
                # Call the function with the current playlist_id and append the result to the list
            
            video_details = get_video_details_from_videoIds(playlist_id=row['all_videos_playlist'], max=10,api = api)
            # video_cache[row['all_videos_playlist']] = video_details  # Cache the result
            
            channel_info["videos"] = (video_details)
            
            channels_info.append(channel_info)  # Append the channel info to the list

        # Return the structured data as a JSON response
        return jsonify({
            "channels_info": channels_info,
        }), 200

    except Exception as e:
        # Return the error message in the response
        return jsonify({"error": f"An error occurred while processing your request: {str(e)}"}), 500


@app.route('/api/videos/avg-view-per-video-playlists', methods=['POST'])
def calculate_average_views():
    try:
        request_data = request.get_json()
        video_details_list = request_data.get('channels_info', None)
        # video_details_list = video_details_list.get('channels_info',None)
        # print("Received request data:", video_details_list)  # Log the received data
        if not video_details_list:
            return jsonify({"error": "video_details_list is required"}), 400
        # Calculate average views along with titles
        average_views = []
        print("HERE....",video_details_list)
        for video_details in video_details_list:
            if not video_details:  # Check for empty video_details
                continue
            # Extract title and views
            print("VIDEO DETAILS...",video_details)
            title = video_details['channel_title']  # Get title from the first video in the list
            videoList = video_details['videos']
            views = [int(video['viewCount']) for video in videoList if 'viewCount' in video]
            # Calculate average view count
            avg_view = sum(views) / len(views) if views else 0
            
            # Append a dictionary with title and average view count
            average_views.append({"title": title, "average_view_count": avg_view})



        

        # Return average views as a list of dictionaries
        return jsonify({"average_views": average_views}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
@app.route('/api/videos/avg-like-per-video-playlists', methods=['POST'])
def calculate_average_likes():
    try:
        request_data = request.get_json()
        video_details_list = request_data.get('channels_info', None)
        # video_details_list = video_details_list.get('channels_info',None)
        # print("Received request data:", video_details_list)  # Log the received data
        if not video_details_list:
            return jsonify({"error": "video_details_list is required"}), 400
        # Calculate average views along with titles
        average_views = []
        for video_details in video_details_list:
            if not video_details:  # Check for empty video_details
                continue
            # Extract title and views
            title = video_details['channel_title']  # Get title from the first video in the list
            videoList = video_details['videos']
            views = [int(video['likeCount']) for video in videoList if 'likeCount' in video]
            # Calculate average view count
            avg_view = sum(views) / len(views) if views else 0
            
            # Append a dictionary with title and average view count
            average_views.append({"title": title, "average_like_count": avg_view})

        # Return average views as a list of dictionaries
        return jsonify({"average_views": average_views}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
@app.route('/api/videos/sentiment-analysis-multichannels', methods=['POST'])
def calculate_sentiment_analysis_multichannels():
    try:
        request_data = request.get_json()
        api = request_data.get('apiKey',None)
        # print("request_data.........",request_data)
        video_details_list = request_data.get('channels_info')
        print("video_details_list..........",video_details_list)
        # Log the received data (Consider using logging instead of print)
        # print("Received request data:", video_details_list)
        
        if not video_details_list:
            return jsonify({"error": "channels_info is required"}), 400
        
        sentiment_analysis_results = []
        
        for video_details in video_details_list:
            if not video_details:  # Check for empty video_details
                continue
            
            # Ensure the necessary keys are present
            title = video_details.get('channel_title')
            videoList = video_details.get('videos')
            if not title or not videoList:  # Ensure title and videos are present
                return jsonify({"error": f"An error occurred: {str(e)}"}), 404
                
            
            videoIds = [video['video_id'] for video in videoList]

            # Call your sentiment analysis function
            sentiment_summary = sentiment_summary_multiple_videos(videoIds,api = api)
            sentiment_analysis_results.append({'title': title, 'sentiment': sentiment_summary})

        return jsonify({"sentimentAnalysis": sentiment_analysis_results}), 200

    except Exception as e:
        print("Error in sentiment analysis multichannels........",e)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# # Run the app for development
# if __name__ == '__main__':
#     app.run(debug=True)
# # Run the app for deployment
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
