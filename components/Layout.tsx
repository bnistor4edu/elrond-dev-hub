import { useMemo } from "react";

import Navbar from "./Navbar";
import Leftbar from "./Navbar/LeftBar";
import SearchBar from "./Navbar/SearchBar";
import PostItemGrid from "./PostItemGrid";
import MonthlyCodingLeaderboard from "./leaderboard/MonthlyLeaderboard";
import PlatformStats from "./stats/PlatformStats";

import News from "./stats/News";

interface IColumnClasses {
  leftColumn: string;
  centerColumn: string;
  rightColum: string;
}

export default function Layout({ hideRightBar = false, children }: any) {
  const columnClasses = useMemo<IColumnClasses>(() => {
    if (hideRightBar) {
      return {
        leftColumn: "hidden sm:block sm:w-1/4 md:w-3/12 lg:w-2/12",
        centerColumn: "w-full sm:w-3/4 md:w-9/12 lg:w-10/12 sm:px-8",
        rightColum: "hidden",
      };
    }
    return {
      leftColumn: "hidden sm:block sm:w-1/4 md:w-3/12 lg:w-2/12",
      centerColumn: "w-full sm:w-3/4 md:w-9/12 lg:w-7/12 sm:pl-8 lg:px-8",
      rightColum: "hidden sm:w-3/12 lg:block",
    };
  }, [hideRightBar]);

  const mainBanner = {
    title: "/AI_MegaWave Hackathon",
    description:
      "Join the AI MegaWave Hackathon and win up to $150,000 in prizes. The hackathon is organized by MultiversX and is open to all developers. Feb 12 - Mar 7, 2025.",
    image_url: "/banner/top-banner.png",
    resource_url: "https://multiversx.com/ai-megawave",
  };

  return (
    <div>
      <Navbar />
      <div className="px-8">
        <div className="max-w-screen-xl mx-auto flex">
          <div
            className={`${columnClasses.leftColumn} py-10 border-theme-border dark:border-theme-border-dark main-content-height overflow-y-auto`}
          >
            <Leftbar />
          </div>
          <main
            className={`${columnClasses.centerColumn} pb-32 pt-10 sm:pb-10 main-content-height overflow-y-auto`}
          >
            {/* <a href={mainBanner.resource_url} target="_blank" rel="noreferrer">
              <img
                src={mainBanner.image_url}
                alt={mainBanner.title}
                className="rounded-md mb-8 shadow-lg dark:shadow-2xl"
              />
            </a> */}
            {children}
          </main>
          <div
            className={`${columnClasses.rightColum} py-10 px-2 main-content-height overflow-y-auto`}
          >
            {/* <div className="p-6 bg-theme-title  dark:bg-secondary-dark-lighter rounded-md">
              <p className="font-semibold text-xl text-white dark:text-theme-title-dark mb-5">
                Check out the official Telegram group for Elrond developers.
              </p>
              <Button label="Join now" icon={FaTelegramPlane} href="https://t.me/ElrondDevelopers" />
            </div> */}

            <div className="flex flex-col gap-10">
              {/* <MonthlyCodingLeaderboard /> */}
              <News />
              <PlatformStats />
              {/* <PostItemGrid
                post={{
                  title: mainBanner.title,
                  description: mainBanner.description,
                  image_url: mainBanner.image_url,
                  resource_url: mainBanner.resource_url,
                  author: "MultiversX",
                }}
                imageHeight="h-42"
                showLinks={false}
              /> */}
              {/* <PostItemGrid
                post={{
                  title: "xDevHub presentation at X Day",
                  description:
                    "We talked about the xDevHub rebranding and some other important announcements on the Hub",
                  image_url: "/hub-x-day.jpeg",
                  resource_url: "https://youtu.be/VSMV4G2VeSc?t=24816",
                  author: "MultiversX",
                }}
                imageHeight="h-36"
                showLinks={false}
              />
              <div className="my-8"></div>
              <PostItemGrid
                post={{
                  title: "xDevHub launch w/ Beniamin Mincu",
                  description:
                    "We talked about the Dev Hub, MultiversX's plan to onboard the next wave of developers and we took a lot of questions from the community.",
                  image_url: "/hub-launch.jpg",
                  resource_url: "https://youtu.be/C5e0oc3DWEo?t=94",
                  author: "Razvan Statescu",
                }}
                imageHeight="h-36"
                showLinks={false}
              /> */}
            </div>

            {/* <div className="mt-10">
              <PostItemGrid
                post={{
                  title: "AMA with Beniamin",
                  description: "Thursday 14th July at 14:00 UTC",
                  image_url: "https://pbs.twimg.com/media/FXDgOEQWAAEdTpf?format=jpg&name=medium",
                  resource_url: "https://egld.community/amas/elrond",
                  author: "EGLD Community",
                }}
                imageHeight="h-42"
                showLinks={false}
              />
            </div> */}

            {/* <div className="mt-10">
              <a className="twitter-timeline" href="https://twitter.com/ElrondNetwork">
                Tweets by ElrondNetwork
              </a>
            </div> */}
          </div>
        </div>
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 w-full px-4 py-3 bg-white dark:bg-secondary-dark border-t border-theme-border/20 dark:border-theme-border-dark/20 shadow-lg backdrop-blur-sm z-50">
        <div className="max-w-sm mx-auto">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
