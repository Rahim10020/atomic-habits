# Atomic Habits

A habit tracking application based on James Clear's "Atomic Habits" methodology. Build better habits using the 4 Laws of Behavior Change.

## Features

- **Identity-Based Habits**: Define who you want to become, not just what you want to achieve
- **4 Laws Implementation**: Create habits using Make it Obvious, Attractive, Easy, and Satisfying
- **Daily Tracking**: Track morning, evening, and anytime routines
- **Streak System**: Monitor your consistency with streak counters
- **Progress Visualization**: View your habit completion over time
- **Two-Minute Rule**: Each habit includes a simplified 2-minute version
- **Bad Habit Tracking**: Identify and break unwanted habits

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Rahim10020/atomic-habits.git

# Navigate to project directory
cd atomic-habits

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── (dashboard)/       # Dashboard layout and pages
│   └── onboarding/        # User onboarding flow
├── components/
│   ├── ui/                # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   ├── habits/            # Habit management components
│   └── onboarding/        # Onboarding flow components
├── lib/
│   ├── supabase/          # Database client and queries
│   ├── context/           # React contexts (Auth, Theme)
│   ├── utils/             # Utility functions
│   └── hooks/             # Custom React hooks
└── types/                 # TypeScript type definitions
```

## Usage

### Creating a Habit

1. Navigate to "New Habit" in the sidebar
2. Define your habit using the 4 Laws:
   - **Cue**: When and where will you perform this habit?
   - **Craving**: What makes this habit attractive?
   - **Response**: What's the easiest version (2 minutes)?
   - **Reward**: How will you celebrate completion?

### Tracking Progress

- Check off habits daily from your dashboard
- View streak counts for each habit
- Monitor overall completion percentage
- Review progress charts over time

## Database Schema

The application uses the following main tables:

- `identities` - User identity and core values
- `habits` - Habit definitions with 4 Laws data
- `habit_logs` - Daily completion records
- `bad_habits` - Habits to break

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- James Clear for the "Atomic Habits" methodology
- [Next.js](https://nextjs.org/) team
- [Supabase](https://supabase.com/) team
- [Tailwind CSS](https://tailwindcss.com/) team
