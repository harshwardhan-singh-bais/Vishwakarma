# Vishwakarma 🛠️

**Enhancing the Digital Presence of Local Indian Artisans**

Vishwakarma is a comprehensive Django-based project management platform designed to help local Indian artisans grow their businesses and enter new markets through digital transformation and data-driven insights.

## 🌟 Features

- **Project Management**: Create and manage business growth projects with two main types:
  - **Grow a Business**: Enhance existing business operations
  - **New Market Entry**: Expand into new markets and opportunities

- **Interactive Analysis**: AI-powered analysis using Google Gemini API for business insights
- **Data Visualization**: Charts and statistics to track project progress
- **API Integration**: Support for social media platforms (Instagram, YouTube) and e-commerce (Flipkart)
- **Chatbot Support**: Intelligent assistant for project guidance
- **Progressive Web App (PWA)**: Mobile-optimized experience

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- PostgreSQL
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshwardhan-singh-bais/Vishwakarma.git
   cd Vishwakarma/vishwakarma
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   Create a `.env` file in the project root:
   ```env
   DEBUG=True
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=postgresql://username:password@localhost:5432/vishwakarma_db
   SECRET_KEY=your_secret_key_here
   ```

5. **Database Setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

   Visit `http://127.0.0.1:8000/` to access the application.

## 🏗️ Project Structure

```
vishwakarma/
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── artisan/              # Main application
│   ├── models.py         # Database models (Project, ApiKeys)
│   ├── views.py          # API endpoints and business logic
│   ├── urls.py           # URL routing
│   ├── static/           # CSS, JS, and static assets
│   ├── templates/        # HTML templates
│   └── migrations/       # Database migrations
└── vishwakarma/          # Django project configuration
    ├── settings.py       # Project settings
    ├── urls.py          # Root URL configuration
    └── wsgi.py          # WSGI configuration
```

## 📊 API Endpoints

### Projects API
- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create new project
- `GET /api/projects/{id}/` - Get project details
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project

### Analysis & Statistics
- `POST /api/analysis/` - Generate AI-powered business analysis
- `GET /api/statistics/` - Get project statistics
- `POST /api/chat/` - Chatbot interaction

### API Keys Management
- `GET/POST /api/projects/{id}/api-keys/` - Manage social media API keys

## 🛠️ Technologies Used

- **Backend**: Django 5.1.4, Python
- **Database**: PostgreSQL with psycopg
- **AI Integration**: Google Gemini API, LangChain
- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **Environment**: python-dotenv for configuration
- **Database Tools**: dj-database-url for connection management

## 🎯 Use Cases

### For Artisans
- **Business Growth**: Track and analyze business expansion metrics
- **Market Research**: Get AI-powered insights for new market entry
- **Digital Presence**: Manage social media and e-commerce integrations
- **Progress Tracking**: Visualize business development through charts

### For Business Consultants
- **Project Management**: Organize multiple artisan projects
- **Data Analysis**: Generate comprehensive business reports
- **Client Communication**: Use chatbot for instant support

## 🔧 Configuration

### Database Configuration
The application uses PostgreSQL by default. Configure your database connection in the `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
```

### API Keys Setup
Set up your API keys for enhanced functionality:

1. **Google Gemini API**: Required for AI-powered analysis
2. **Social Media APIs**: Optional for Instagram/YouTube integration
3. **E-commerce APIs**: Optional for Flipkart integration

## 🚀 Deployment

### Production Deployment
1. Set `DEBUG=False` in your environment
2. Configure `ALLOWED_HOSTS` for your domain
3. Use a production-grade database
4. Set up static file serving
5. Configure HTTPS

### Supported Platforms
- Render.com (configured)
- Cloudflare tunnels (configured)
- Any Django-compatible hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the rich tradition of Indian craftsmanship
- Built to empower local artisans in the digital age
- Thanks to the Django and Python communities

## 📧 Contact

**Harshwardhan Singh Bais**
- GitHub: [@harshwardhan-singh-bais](https://github.com/harshwardhan-singh-bais)
- Project Link: [https://github.com/harshwardhan-singh-bais/Vishwakarma](https://github.com/harshwardhan-singh-bais/Vishwakarma)

---

**Made with ❤️ for Indian Artisans**