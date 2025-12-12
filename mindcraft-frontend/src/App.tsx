import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthenticatedLayout from "@/Layout/AuthenticatedLayout";
import UnAuthenticatedLayout from "@/Layout/UnAutheticatedLayout";

// import LandingPage from "./pages/general/Landingpage";
// import PageNotFound from "./pages/general/PageNotFound";

// import LoginPage from "./pages/auth/LoginPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LandingPage from "./pages/general/LandingPage";
import DashboardPage from "./pages/home/DashboardPage";
import ChallengePage from "./pages/home/ChallengePage";
import PortfolioPage from "./pages/home/PortfolioPage";
import LeaderboardPage from "./pages/home/LeaderboardPage";
import SkillPathsPage from "./pages/home/SkillPathsPage";
import BadgesPage from "./pages/home/BadgesPage";
import AchievementsPage from "./pages/home/AchievementsPage";
import WorkflowTestPage from "./pages/home/WorkflowTestPage";
import AIGenerateChallengePage from "./pages/home/AIGenerateChallengePage";
import SelectSkillPathAndGeneratePage from "./pages/home/SelectSkillPathAndGeneratePage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <UnAuthenticatedLayout />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/auth/login",
          element: <LoginPage />,
        },
        {
          path: "/auth/register",
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: "/home",
      element: <AuthenticatedLayout />,
      children: [
        {
          path: "/home/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/home/challenge/:challengeId",
          element: <ChallengePage />,
        },
        {
          path: "/home/portfolio",
          element: <PortfolioPage />,
        },
        {
          path: "/home/leaderboard",
          element: <LeaderboardPage />,
        },
        {
          path: "/home/skill-paths",
          element: <SkillPathsPage />,
        },
        {
          path: "/home/challenges",
          element: <SkillPathsPage />,
        },
        {
          path: "/home/badges",
          element: <BadgesPage />,
        },
        {
          path: "/home/achievements",
          element: <AchievementsPage />,
        },
        {
          path: "/home/workflow-test",
          element: <WorkflowTestPage />,
        },
        {
          path: "/home/ai-generate-challenge",
          element: <AIGenerateChallengePage />,
        },
        {
          path: "/home/select-and-generate",
          element: <SelectSkillPathAndGeneratePage />,
        },
      ],
    },
    {
      path: "*",
      // element: <PageNotFound />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
