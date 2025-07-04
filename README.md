
# Tube-Metrics 📊

A comprehensive web application that provides detailed insights and data analysis for YouTube channels. Built with modern web technologies to deliver powerful analytics and visualizations for content creators and marketers.

## 📸 Screenshots

### User Profile

![Dashboard](/assets/user-profile.png)

### Dashboard

![Channel Analytics](/assets/dashboard.png)

### Multi-Channel Comparison

![Multi-Channel Comparison](/assets/comparison.png)

## 🚀 Features

### Channel Analytics

-   **Top 5 Videos by View Count** - Identify your most popular content
-   **Most Liked Videos** - Track engagement through likes
-   **Most Commented Videos** - Discover content that sparks conversation
-   **Monthly View Distribution** - Understand viewing patterns over time
-   **Comment Sentiment Analysis** - Gauge audience reaction with percentage breakdowns
-   **Views Over Time** - Track channel growth and performance trends
-   **Recent Videos Overview** - Monitor latest content performance

### Multi-Channel Comparison

-   **Subscriber Comparison** - Compare subscriber counts across channels
-   **Video Count Analysis** - Analyze content volume strategies
-   **View Count Metrics** - Compare total and average views
-   **Average Likes Comparison** - Measure engagement levels
-   **Average Views Analysis** - Understand content performance
-   **Sentiment Ratio Analysis** - Compare audience sentiment across channels

## 🛠️ Tech Stack

### Frontend

-   **React.js** - Modern JavaScript library for building user interfaces
-   **Material-UI** - React component library for consistent design
-   **Auth0** - Authentication and authorization platform

### Backend

-   **Flask** - Python web framework for API development
-   **Python** - Server-side programming language

## 📁 Project Structure

```
tube-metrics/
├── Backend/                 # Flask API server
├── Frontend-Student/        # React.js frontend application
├── node_modules/           # Node.js dependencies
├── screenshots/            # Application screenshots
├── package-lock.json       # Dependency lock file
└── package.json           # Project dependencies and scripts


```

## 🔧 Installation

### Prerequisites

-   Node.js (v14 or higher)
-   Python (v3.8 or higher)
-   pip (Python package manager)

### Frontend Setup

1.  Navigate to the frontend directory:
    
    ```bash
    cd Frontend-Student
    
    
    ```
    
2.  Install dependencies:
    
    ```bash
    npm install
    
    
    ```
    
3.  Create a `.env` file and add your configuration:
    
    ```env
    REACT_APP_API_URL=your-api-url
    REACT_APP_URL=your-app-url
    REACT_APP_IS_DEMO=false
    
    
    ```
    
4.  Start the development server:
    
    ```bash
    npm start
    
    
    ```
    

### Backend Setup

1.  Navigate to the backend directory:
    
    ```bash
    cd Backend
    
    
    ```
    
2.  Create a virtual environment:
    
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    
    
    ```
    
3.  Install Python dependencies:
    
    ```bash
    pip install -r requirements.txt
    
    
    ```
    
4.  Create a `.env` file and add your configuration:
    
    ```env
    API_KEY=your-youtube-api-key
    API_SERVICE_NAME=youtube
    API_VERSION=v3
    CLOUDINARY_API_KEY=your-cloudinary-api-key
    CLOUDINARY_API_SECRET=your-cloudinary-api-secret
    CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
    DEBUG=True
    MONGO_URI=your-mongodb-connection-string
    
    
    ```
    
5.  Start the Flask server:
    
    ```bash
    python app.py
    
    
    ```
    

## 🚀 Usage

1.  **Authentication**: Sign up or log in using Auth0 integration
2.  **Channel Analysis**: Enter a YouTube channel URL or handle to analyze
3.  **View Insights**: Explore comprehensive analytics and visualizations
4.  **Compare Channels**: Add multiple channels for comparative analysis
5.  **Export Data**: Download insights and reports for further analysis

## 🔒 Authentication

This application uses Auth0 for secure authentication. Users must sign in to access analytics features and save their analysis history.

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://claude.ai/chat/LICENSE) file for details.

## 🙏 Acknowledgments

-   YouTube Data API for providing comprehensive channel data
-   Auth0 for secure authentication services
-   Material-UI for beautiful React components
-   Flask community for excellent documentation

----------

**Built with ❤️ by [hetchaudhari123](https://github.com/hetchaudhari123)**
