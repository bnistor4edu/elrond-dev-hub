import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiStar, FiHeart, FiSearch, FiX, FiPlusCircle, FiGrid, FiList, FiRefreshCw } from "react-icons/fi";
import Button from "../../components/shared/Button";
import CategoryBadge from "../../components/shared/CategoryBadge";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import SubmitProjectRequest from "../../components/forms/SubmitProjectRequest";
import CoolLoader from "../../components/shared/CoolLoader";

interface ProjectRequestItem {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  estimated_budget: string | null;
  estimated_timeline: string | null;
  technical_requirements: string | null;
  contact_email: string | null;
  contact_telegram: string | null;
  submitter_name: string | null;
  status: string;
  votes: number;
  vote_ips: string[];
  interested_developers: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProjectRequestsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("votes");
  const [requestData, setRequestData] = useState<ProjectRequestItem[]>([]);
  const [userIP, setUserIP] = useState<string | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIP(data.ip))
      .catch((error) => console.error("Error fetching IP:", error));
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const today = new Date().toISOString();

      const { data, error } = await supabase
        .from("x_projects_requests")
        .select("*")
        .lte("published_at", today)
        .not("published_at", "is", null)
        .order("votes", { ascending: false });

      if (error) {
        console.error("Error fetching project requests:", error);
      } else {
        setRequestData(data || []);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleVoteClick = async (
    requestId: number,
    currentVotes: number,
    currentVoteIps: string[]
  ) => {
    if (!userIP) return;

    const hasVoted = currentVoteIps.includes(userIP);
    const newVoteIps = hasVoted
      ? currentVoteIps.filter((ip) => ip !== userIP)
      : [...currentVoteIps, userIP];

    const newVotes = hasVoted ? currentVotes - 1 : currentVotes + 1;

    const { error } = await supabase
      .from("x_projects_requests")
      .update({
        votes: newVotes,
        vote_ips: newVoteIps,
      })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating votes:", error);
    } else {
      setRequestData((prevData) =>
        prevData.map((request) =>
          request.id === requestId
            ? { ...request, votes: newVotes, vote_ips: newVoteIps }
            : request
        )
      );
    }
  };

  const handleInterestClick = async (
    requestId: number,
    currentInterested: string[]
  ) => {
    if (!userIP) return;

    const hasExpressedInterest = currentInterested.includes(userIP);
    const newInterested = hasExpressedInterest
      ? currentInterested.filter((ip) => ip !== userIP)
      : [...currentInterested, userIP];

    const { error } = await supabase
      .from("x_projects_requests")
      .update({
        interested_developers: newInterested,
      })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating interest:", error);
    } else {
      setRequestData((prevData) =>
        prevData.map((request) =>
          request.id === requestId
            ? { ...request, interested_developers: newInterested }
            : request
        )
      );
    }
  };

  const filteredRequests = requestData
    .filter(
      (item) => activeCategory === "all" || item.category === activeCategory
    )
    .filter((item) =>
      searchTerm
        ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.submitter_name &&
            item.submitter_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        : true
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "votes":
          return b.votes - a.votes;
        case "interest":
          return b.interested_developers.length - a.interested_developers.length;
        case "recent":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "priority":
          const priorityOrder = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        default:
          return a.title.localeCompare(b.title);
      }
    });

  return (
    <Layout hideRightBar={true}>
      <NextSeo
        title="MultiversX Project Requests | Community Wishlist"
        description="Browse and submit project requests for the MultiversX ecosystem. Vote on ideas and connect with developers to bring projects to life."
        openGraph={{
          images: [
            {
              url: `https://xdevhub.com/og-image.png`,
              width: 1200,
              height: 675,
              type: "image/png",
            },
          ],
        }}
      />

      <div className="container mx-auto">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary-dark/10 dark:to-primary-dark/20 rounded-2xl p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-theme-title dark:text-theme-title-dark mb-4 relative">
              Project Requests
              <div className="absolute w-14 h-0.5 bg-primary dark:bg-primary-dark left-1/2 transform -translate-x-1/2 bottom-0"></div>
            </h1>
            <p className="text-sm md:text-base text-theme-text dark:text-theme-text-dark max-w-3xl mx-auto">
              Have an idea for a MultiversX project? Submit a request and let the community vote on it. Developers can express interest and collaborate to bring your vision to life.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <div onClick={() => setShowSubmitForm(true)}>
              <Button
                label="Submit Request"
                icon={FiPlusCircle}
                class="text-sm py-2 px-4"
              />
            </div>
          </div>
        </div>

        <div className="mb-5 bg-white dark:bg-secondary-dark rounded-xl shadow-lg p-3 border border-theme-border dark:border-theme-border-dark">
          <div className="flex flex-col md:flex-row justify-between items-center mb-3">
            <div className="mb-3 md:mb-0">
              <h2 className="text-base font-semibold text-theme-title dark:text-theme-title-dark flex items-center">
                <span className="mr-2">Community Requests</span>
                {filteredRequests.length > 0 && (
                  <span className="text-xs font-normal text-theme-text/60 dark:text-theme-text-dark/60">
                    ({filteredRequests.length} found)
                  </span>
                )}
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 pr-7 py-1.5 text-xs rounded-md border border-theme-border dark:border-theme-border-dark bg-gray-50 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark w-full md:w-auto"
                />
                <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-theme-text/50 dark:text-theme-text-dark/50 w-3 h-3" />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-theme-text/50 dark:text-theme-text-dark/50 hover:text-theme-text dark:hover:text-theme-text-dark"
                  >
                    <FiX size={12} />
                  </button>
                )}
              </div>

              <div className="flex items-center text-xs font-medium">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-l-md ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <FiGrid size={12} /> Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-r-md ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <FiList size={12} /> List
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1.5 px-2 text-xs rounded-md border border-theme-border dark:border-theme-border-dark bg-gray-50 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark"
              >
                <option value="votes">Sort by Votes</option>
                <option value="interest">Sort by Interest</option>
                <option value="recent">Sort by Recent</option>
                <option value="priority">Sort by Priority</option>
                <option value="title">Sort by Title</option>
              </select>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                  showFilters 
                    ? "bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-dark" 
                    : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <FiSearch className={`w-3 h-3 ${showFilters ? "text-primary dark:text-primary-dark" : ""}`} />
                {showFilters ? "Hide Filters" : "More Filters"}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-2 border-t border-theme-border/30 dark:border-theme-border-dark/30">
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="flex flex-wrap gap-1 pt-1">
                  {Array.from(new Set(requestData.map((item) => item.category)))
                    .map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                          activeCategory === category
                            ? "bg-primary text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchTerm("");
                    setSortBy("votes");
                  }}
                  className="flex items-center gap-1 py-1 px-2 text-xs bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <FiRefreshCw size={10} />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 max-w-3xl mx-auto">
            <p className="font-semibold text-sm mb-2">No project requests found</p>
            <p className="text-xs mb-4">Try adjusting your search or browse all categories</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setActiveCategory("all")}
                className="flex items-center gap-1 py-1.5 px-3 text-xs bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FiSearch size={10} />
                Browse All Requests
              </button>
              <button 
                onClick={() => setShowSubmitForm(true)}
                className="flex items-center gap-1 py-1.5 px-3 text-xs bg-primary dark:bg-primary-dark text-white rounded-md hover:bg-primary-dark"
              >
                <FiPlusCircle size={10} />
                Submit Request
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-secondary-dark rounded-lg border border-theme-border dark:border-theme-border-dark shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <CategoryBadge category={request.category} size="sm" />
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      request.priority === "Critical"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : request.priority === "High"
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                        : request.priority === "Medium"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                        : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    }`}>
                      {request.priority}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-theme-title dark:text-theme-title-dark">{request.title}</h3>
                    <p className="text-xs text-theme-text/80 dark:text-theme-text-dark/80 mt-1 line-clamp-3">{request.description}</p>
                  </div>
                  
                  {request.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {request.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {request.tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{request.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {(request.estimated_budget || request.estimated_timeline) && (
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      {request.estimated_budget && (
                        <div>
                          <span className="font-medium text-theme-text/70 dark:text-theme-text-dark/70">Budget:</span>
                          <span className="ml-1 text-theme-text dark:text-theme-text-dark">{request.estimated_budget}</span>
                        </div>
                      )}
                      {request.estimated_timeline && (
                        <div>
                          <span className="font-medium text-theme-text/70 dark:text-theme-text-dark/70">Timeline:</span>
                          <span className="ml-1 text-theme-text dark:text-theme-text-dark">{request.estimated_timeline}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {request.submitter_name && (
                    <div className="mb-3 text-xs">
                      <span className="font-medium text-theme-text/70 dark:text-theme-text-dark/70">Requested by:</span>
                      <span className="ml-1 text-theme-text dark:text-theme-text-dark">{request.submitter_name}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleVoteClick(request.id, request.votes, request.vote_ips)}
                        className={`flex items-center text-xs rounded-full px-2 py-1 ${
                          userIP && request.vote_ips.includes(userIP)
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <FiStar className={`mr-1 w-3 h-3 ${userIP && request.vote_ips.includes(userIP) ? "text-blue-500" : ""}`} />
                        {request.votes}
                      </button>

                      <button
                        onClick={() => handleInterestClick(request.id, request.interested_developers)}
                        className={`flex items-center text-xs rounded-full px-2 py-1 ${
                          userIP && request.interested_developers.includes(userIP)
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <FiHeart className={`mr-1 w-3 h-3 ${userIP && request.interested_developers.includes(userIP) ? "text-green-500" : ""}`} />
                        {request.interested_developers.length}
                      </button>
                    </div>
                    
                    <div className="text-xs text-theme-text/60 dark:text-theme-text-dark/60">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {filteredRequests.map((request) => (
              <div 
                key={request.id}
                className="bg-white dark:bg-secondary-dark rounded-lg border border-theme-border dark:border-theme-border-dark shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-theme-title dark:text-theme-title-dark">{request.title}</h3>
                        <div className="flex items-center mt-1">
                          <CategoryBadge category={request.category} size="sm" />
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            request.priority === "Critical"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              : request.priority === "High"
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                              : request.priority === "Medium"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                              : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          }`}>
                            {request.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-theme-text/80 dark:text-theme-text-dark/80 mb-2 line-clamp-2">{request.description}</p>
                    
                    {request.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {request.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-x-6 gap-y-1 mb-2">
                      {request.submitter_name && (
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                            Requested by:
                          </span>
                          <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                            {request.submitter_name}
                          </span>
                        </div>
                      )}
                      {request.estimated_budget && (
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                            Budget:
                          </span>
                          <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                            {request.estimated_budget}
                          </span>
                        </div>
                      )}
                      {request.estimated_timeline && (
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                            Timeline:
                          </span>
                          <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                            {request.estimated_timeline}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                          Created:
                        </span>
                        <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVoteClick(request.id, request.votes, request.vote_ips)}
                        className={`flex items-center text-xs rounded-full px-2 py-1 ${
                          userIP && request.vote_ips.includes(userIP)
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <FiStar className={`mr-1 w-3 h-3 ${userIP && request.vote_ips.includes(userIP) ? "text-blue-500" : ""}`} />
                        {request.votes}
                      </button>

                      <button
                        onClick={() => handleInterestClick(request.id, request.interested_developers)}
                        className={`flex items-center text-xs rounded-full px-2 py-1 ${
                          userIP && request.interested_developers.includes(userIP)
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <FiHeart className={`mr-1 w-3 h-3 ${userIP && request.interested_developers.includes(userIP) ? "text-green-500" : ""}`} />
                        {request.interested_developers.length}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSubmitForm && (
        <SubmitProjectRequest onClose={() => setShowSubmitForm(false)} />
      )}

      {loading && (
        <div className="py-10">
          <CoolLoader 
            message="Loading project requests..." 
            size="lg"
          />
        </div>
      )}
    </Layout>
  );
}
