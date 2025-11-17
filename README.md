# Pulikon 📊

> Instagram Follower Analysis Tool

**Live Demo:** [https://fmaule.github.io/pulikon/](https://fmaule.github.io/pulikon/)

A privacy-focused web app that analyzes your Instagram follower data to show who's not following you back, track follower changes over time, and identify unfollows—all processed locally in your browser.

## ✨ Features

- 📤 **Easy Upload**: Drag and drop your Instagram data export ZIP file
- 🔍 **Current Snapshot Analysis**:
  - People you follow who don't follow you back
  - Your followers who you don't follow back
  - Mutual connections
- 📈 **Change Tracking**:
  - New unfollows since your last check
  - New followers since your last check
  - People you unfollowed
  - New mutual connections
- 💾 **Baseline Management**: Save your current state as a baseline for future comparisons
- 🔒 **100% Private**: All data processing happens in your browser—nothing is uploaded to any server
- ⚡ **Fast & Modern**: Built with React 19, Vite, and TypeScript

## 🚀 How to Use

1. **Get Your Instagram Data**:
   - Open Instagram app or website
   - Go to Settings → Account Center → Your information and permissions → Download your information
   - Select your account
   - Choose "Some of your information" → Select "Followers and following"
   - Format: JSON, Date range: All time
   - Download to device
   - Wait for Instagram to prepare your data (can take a few minutes to hours)
   - Download the ZIP file when ready

2. **Upload & Analyze**:
   - Open [Pulikon](https://fmaule.github.io/pulikon/)
   - Drag and drop the ZIP file or click to browse
   - View your analysis instantly

3. **Track Changes Over Time**:
   - On your first upload, the current state is automatically saved as your baseline
   - Upload new exports later to see who unfollowed you, who started following you, etc.
   - Use "Save Current as Baseline" to update your reference point
   - Use "Clear Baseline" to start fresh

## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/fmaule/pulikon.git
cd pulikon

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## 📦 Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool and dev server
- **Biome** - Fast linting and formatting
- **JSZip** - ZIP file processing
- **GitHub Pages** - Free hosting
- **GitHub Actions** - Automated deployment

## 📁 Project Structure

```
pulikon/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx      # Main upload and analysis component
│   │   └── FileUpload.css      # Component styles
│   ├── App.tsx                 # Root component
│   ├── App.css                 # App styles
│   ├── index.css               # Global styles
│   └── main.tsx                # Entry point
├── openspec/                   # OpenSpec development workflow
│   ├── project.md              # Project conventions
│   ├── specs/                  # Feature specifications
│   └── changes/                # Active and archived changes
├── .github/workflows/          # CI/CD pipelines
└── vite.config.ts              # Vite configuration
```

## 🔍 How It Works

1. **ZIP Processing**: Uses JSZip to extract `followers_1.json` and `following.json` from your Instagram export
2. **Data Parsing**: Extracts usernames and profile URLs from the JSON structure
3. **Diff Calculation**: Compares followers and following lists to categorize relationships
4. **Change Detection**: Compares current data with stored baseline (saved in browser localStorage)
5. **Visualization**: Displays results in organized, color-coded sections

## 🔐 Privacy & Security

- **No Server Upload**: All processing happens in your browser using JavaScript
- **No Data Collection**: We don't collect, store, or transmit any of your data
- **Local Storage Only**: Baselines are saved in your browser's localStorage
- **Open Source**: Full transparency—inspect the code yourself

## 🤝 Contributing

This project follows the [OpenSpec](https://github.com/openspec-oss/spec) development workflow:

1. Create a proposal in `openspec/changes/<change-name>/proposal.md`
2. Implement the change following the tasks
3. Archive completed changes to `openspec/changes/archive/`

See `openspec/AGENTS.md` for detailed instructions.

## 📄 License

MIT License - feel free to use this project however you'd like.

## 🙏 Acknowledgments

Built with modern web technologies and designed to respect user privacy. Special thanks to the React, Vite, and Biome teams for their excellent tools.
