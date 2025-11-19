# Chakra UI Dashboard

A professional, modern dashboard built with React, Chakra UI, and Redux Toolkit.

## 🚀 Features

- **Modern UI/UX**: Built with Chakra UI for beautiful, accessible components
- **Real-time Data**: Auto-refresh dashboard data every 30 seconds
- **Responsive Design**: Mobile-first responsive layout
- **Professional Charts**: Integrated Chart.js for data visualization
- **State Management**: Redux Toolkit for efficient state management
- **Authentication**: Protected routes with mock authentication
- **Dark Mode**: Toggle between light and dark themes
- **Animations**: Smooth animations with Framer Motion

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **UI Framework**: Chakra UI 2.8
- **State Management**: Redux Toolkit
- **Charts**: Chart.js with react-chartjs-2
- **Animations**: Framer Motion
- **Icons**: React Icons, Feather Icons
- **Styling**: Emotion (CSS-in-JS)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── dashboard/          # Dashboard pages and components
├── redux/             # Redux store and slices
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── App.jsx            # Main app component
└── main.jsx           # App entry point
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🔐 Authentication

The dashboard uses mock authentication for demonstration:
- **Username**: Any email
- **Password**: Any password
- **Demo User**: Pre-loaded with sample data

## 📊 Dashboard Features

### KPI Cards
- Total Opportunities
- Active Customers
- Total Revenue
- Active Devices

### Charts & Analytics
- Lead Distribution (Doughnut Chart)
- Financial Overview
- Performance Trends (Line Chart)
- Team Leaderboard

### Real-time Updates
- Auto-refresh every 30 seconds
- Live data from API endpoints
- Fallback to mock data

## 🎨 Customization

### Theme Colors
The dashboard uses a custom Chakra UI theme with:
- **Brand Colors**: Blue palette
- **Success Colors**: Green palette
- **Warning Colors**: Yellow palette
- **Error Colors**: Red palette

### Components
All components are built with Chakra UI primitives and can be easily customized using the theme system.

## 🔧 API Integration

The dashboard is designed to work with the FunnelEye API:
- **Base URL**: `https://api.funnelseye.com`
- **Endpoints**: Coach dashboard data endpoints
- **Authentication**: Bearer token authentication
- **Fallback**: Mock data when API is unavailable

## 📱 Responsive Design

- **Mobile**: Stacked layout with collapsible sidebar
- **Tablet**: Adaptive grid layouts
- **Desktop**: Full-featured dashboard with sidebar navigation

## 🚧 Development Status

- ✅ **Core Structure**: Complete
- ✅ **Authentication**: Complete
- ✅ **Dashboard Layout**: Complete
- ✅ **KPI Cards**: Complete
- ✅ **Charts**: Complete
- 🚧 **Additional Pages**: In Progress
- 🚧 **Advanced Features**: Planned

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.
