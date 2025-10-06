# 🚀 Akshay Juluri - Portfolio

A modern, interactive portfolio website showcasing my journey as a Computer Science Engineering student, competitive programmer, and full-stack developer.

[![Live Demo](https://img.shields.io/badge/Live-Demo-orange?style=for-the-badge)](https://akshayy67.github.io/portfolio/)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=for-the-badge&logo=github)](https://github.com/Akshayy67)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/akshay-juluri-84813928a/)
[![LeetCode](https://img.shields.io/badge/LeetCode-Profile-orange?style=for-the-badge&logo=leetcode)](https://leetcode.com/u/akshayjuluri/)

## 🌟 Features

### 🎨 **Immersive Design**
- **Interstellar-inspired theme** with space aesthetics
- **Smooth parallax scrolling** effects
- **Custom cursor** with glitter trail effects
- **Dark/Light mode** toggle with smooth transitions
- **Responsive design** optimized for all devices
- **Framer Motion animations** throughout

### 📊 **Dynamic Content**
- **Real-time LeetCode stats** fetched from API
  - 600+ problems solved
  - Contest rating: 1695+ (Top 13% globally)
  - Live difficulty breakdown (Easy/Medium/Hard)
- **Project metrics** with performance indicators
- **Interactive project cards** with hover effects
- **Dynamic greetings** based on time of day

### 🛠️ **Technical Highlights**
- **Performance optimized** with lazy loading
- **SEO friendly** with meta tags
- **Google Analytics** integration
- **Email contact form** with EmailJS
- **AI-powered suggestions** in contact form
- **Smooth page transitions**

## 🏗️ Built With

### **Frontend**
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations

### **Libraries & Tools**
- **Lucide React** - Icon library
- **Typed.js** - Typing animations
- **React Intersection Observer** - Scroll animations
- **EmailJS** - Contact form functionality
- **React GA4** - Google Analytics

### **APIs**
- **LeetCode API** - Real-time coding stats
- **Hugging Face API** - AI suggestions

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── profile-2.jpg          # Profile photo
│   ├── resume.pdf             # Resume (add your own)
│   └── [project-images]       # Project screenshots
├── src/
│   ├── components/
│   │   ├── HeroSection.tsx           # Landing section
│   │   ├── AboutSection.tsx          # About me with skills
│   │   ├── ProjectsSection.tsx       # Projects showcase
│   │   ├── BlogSection.tsx           # Achievements & certifications
│   │   ├── ContactSection.tsx        # Contact form
│   │   ├── Navigation.tsx            # Navbar
│   │   ├── ResumeDownloadButton.tsx  # Resume CTA
│   │   └── ...
│   ├── contexts/
│   │   └── ThemeContext.tsx   # Dark/Light mode
│   ├── services/
│   │   ├── leetcodeApi.ts     # LeetCode data fetching
│   │   └── analytics.ts       # Google Analytics
│   ├── config/
│   │   └── emailjs.ts         # Email configuration
│   └── App.tsx                # Main app component
├── .env                       # Environment variables
└── package.json
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akshayy67/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_GA_TRACKING_ID=your_ga_tracking_id
   ```

4. **Add your resume**
   
   Place your `resume.pdf` in the `public/` folder

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser

### **Build for Production**

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

### **Deploy**

```bash
npm run deploy
```

This will deploy to GitHub Pages automatically.

## 📊 Key Sections

### **1. Hero Section**
- Animated name with typing effect
- Profile photo with glow effect
- Social media links (GitHub, LinkedIn)
- Dynamic greeting based on time

### **2. About Section**
- FAANG-optimized developer profile
- Competitive programming achievements
- Technical skills with proficiency levels
- Solar system visualization
- Resume download button

### **3. Projects Section**
- 12+ projects with live demos
- Performance metrics for each project
- Tech stack badges
- GitHub links
- "More Projects" expandable section

**Featured Projects:**
- **SuperApp** - AI-powered academic assistant (500+ users)
- **LRU Cache** - O(1) visualization tool
- **URL Shortener** - 1000+ req/sec throughput
- **Contact Manager** - Trie-based search (O(k) complexity)
- **AVL Tree Visualizer** - Self-balancing BST animations
- And more...

### **4. Achievements Section**
- **Live LeetCode Dashboard**
  - Real-time problem count
  - Difficulty breakdown
  - Clickable to profile
- Hackathon wins
- Certifications (ML, ServiceNow CSA, Juniper Networks)

### **5. Contact Section**
- Email contact form with validation
- AI-powered message suggestions
- Direct contact information
- Resume download option
- LinkedIn integration

## 🎯 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Optimized with code splitting
- **Mobile Responsive**: 100%

## 🔧 Configuration

### **EmailJS Setup**
1. Create account at [EmailJS](https://www.emailjs.com/)
2. Create email service and template
3. Add credentials to `.env` file

### **Google Analytics**
1. Create GA4 property
2. Get tracking ID
3. Add to `.env` file

### **LeetCode Stats**
The portfolio automatically fetches stats from:
```
https://leetcode-api-faisalshohag.vercel.app/akshayjuluri
```
Update the username in `src/services/leetcodeApi.ts` to use your profile.

## 🎨 Customization

### **Colors**
The portfolio uses an orange theme. To customize:
- Edit Tailwind config in `tailwind.config.js`
- Update CSS variables in `src/index.css`

### **Content**
- **Profile**: Update `src/components/AboutSection.tsx`
- **Projects**: Update `src/components/ProjectsSection.tsx`
- **Skills**: Modify skills array in `AboutSection.tsx`
- **Achievements**: Update `src/components/BlogSection.tsx`

### **Images**
- Place images in `public/` folder
- Reference as `/image-name.jpg` in components

## 📈 Analytics & Tracking

The portfolio tracks:
- Page views
- Section views (Hero, About, Projects, Contact)
- Button clicks
- Form submissions
- Resume downloads

View analytics in your Google Analytics dashboard.

## 🤝 Contributing

This is a personal portfolio, but feel free to:
- Fork the repository
- Use it as a template for your own portfolio
- Submit issues for bugs
- Suggest improvements

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 About Me

I'm Akshay Juluri, a Computer Science Engineering student at SNIST with a passion for:
- 🧩 **Competitive Programming** - 600+ LeetCode problems, Top 13% globally
- 💻 **Full-Stack Development** - React, Node.js, Python, Flutter
- 🤖 **Machine Learning** - Stanford/DeepLearning.AI certified
- 🏆 **Hackathons** - Winner of SNIST Summer Hackathon

### **Stats**
- 🎓 CGPA: 8.1/10
- 💪 LeetCode: 600+ problems solved
- 🏅 Contest Rating: 1695+
- 🚀 Projects: 12+ deployed applications
- 📜 Certifications: ML, ServiceNow CSA, Juniper Networks

## 📞 Contact

- **Email**: [akshayjuluri6704@gmail.com](mailto:akshayjuluri6704@gmail.com)
- **LinkedIn**: [akshay-juluri](https://www.linkedin.com/in/akshay-juluri-84813928a/)
- **GitHub**: [@Akshayy67](https://github.com/Akshayy67)
- **LeetCode**: [akshayjuluri](https://leetcode.com/u/akshayjuluri/)
- **Portfolio**: [akshayy67.github.io/portfolio](https://akshayy67.github.io/portfolio/)

## 🙏 Acknowledgments

- Design inspiration from Interstellar movie aesthetics
- Icons from [Lucide React](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- LeetCode API by [Faisal Shohag](https://github.com/faisalshohag)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by [Akshay Juluri](https://github.com/Akshayy67)

</div>

