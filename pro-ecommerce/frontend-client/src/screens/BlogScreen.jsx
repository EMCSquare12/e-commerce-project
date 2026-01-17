import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Calendar,
  User,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

// --- MOCK DATA ---
const BLOG_POSTS = [
  {
    _id: "1",
    title: "iPhone 15 Pro Max: 3 Months Later",
    excerpt:
      "Is the titanium build and the new 5x telephoto lens worth the upgrade? Here is our long-term review of Apple's latest flagship.",
    category: "Reviews",
    author: "Tech Reviewer",
    date: "Oct 12, 2023",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "2",
    title: "Building the Ultimate Gaming PC",
    excerpt:
      "A step-by-step guide to choosing the right GPU, CPU, and cooling system for 4K gaming in 2024.",
    category: "Guides",
    author: "System Builder",
    date: "Oct 08, 2023",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "3",
    title: "Sony WH-1000XM5 vs Bose QC45",
    excerpt:
      "The battle of the noise-canceling giants. We compare sound quality, comfort, and battery life to help you decide.",
    category: "Comparisons",
    author: "Audio Phil",
    date: "Oct 01, 2023",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "4",
    title: "The Future of Foldable Phones",
    excerpt:
      "Are foldables finally durable enough for the mainstream? We look at the Galaxy Z Fold 5 and Pixel Fold.",
    category: "News",
    author: "Mobile Expert",
    date: "Sep 28, 2023",
    image:
      "https://images.unsplash.com/photo-1628146925732-23c230623a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "5",
    title: "Top 5 Mechanical Keyboards Under $100",
    excerpt:
      "You don't need to spend a fortune for a great typing experience. Here are the best budget enthusiast keyboards.",
    category: "Guides",
    author: "Clicky Clack",
    date: "Sep 20, 2023",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "6",
    title: "Drone Photography for Beginners",
    excerpt:
      "Getting started with aerial photography? We break down the regulations and best starter drones like the DJI Mini 3.",
    category: "Tips",
    author: "Sky High",
    date: "Sep 15, 2023",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
];

const BlogScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All",
    "Reviews",
    "Guides",
    "Comparisons",
    "News",
    "Tips",
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-4 py-6 pb-24 mx-auto max-w-7xl sm:px-6 lg:px-8 md:pb-8">
      {/* Page Heading */}
      <h1 className="mb-6 text-2xl font-bold md:text-3xl text-slate-800">
        Latest Articles
      </h1>

      {/* Filter Bar Container */}
      <div className="flex flex-col items-center justify-between gap-3 p-3 mb-8 border border-gray-100 rounded-xl bg-gray-50 md:flex-row md:p-4">
        {/* Filter Button */}
        <div className="relative z-10 w-full md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 md:w-48"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-500" />
              <span>
                {selectedCategory === "All"
                  ? "Filter Category"
                  : selectedCategory}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="absolute left-0 w-full mt-2 duration-200 bg-white border border-gray-100 rounded-lg shadow-xl top-full md:w-48 animate-in fade-in slide-in-from-top-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowFilters(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    selectedCategory === cat
                      ? "text-amber-600 font-bold bg-amber-50"
                      : "text-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-4 pr-10 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <Search className="absolute w-4 h-4 text-gray-400 right-3 top-3" />
        </div>
      </div>

      {/* Blog Post Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article
            key={post._id}
            className="flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-lg hover:-translate-y-1"
          >
            {/* Image */}
            <Link
              to={`/blog/${post._id}`}
              className="relative block w-full overflow-hidden aspect-video group"
            >
              <img
                src={post.image}
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase rounded-md bg-slate-900/90 backdrop-blur-sm shadow-sm">
                  {post.category}
                </span>
              </div>
            </Link>

            <div className="flex flex-col flex-grow p-4 md:p-5">
              {/* Meta Date/Author */}
              <div className="flex items-center gap-3 mb-2 text-xs font-medium text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {post.date}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {post.author}
                </span>
              </div>

              {/* Title */}
              <Link to={`/blog/${post._id}`} className="block mb-2">
                <h2 className="text-base font-bold leading-tight transition-colors md:text-lg text-slate-800 hover:text-amber-600 line-clamp-2">
                  {post.title}
                </h2>
              </Link>

              {/* Excerpt */}
              <p className="flex-grow mb-4 text-sm leading-relaxed text-gray-500 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Read More Link */}
              <Link
                to={`/blog/${post._id}`}
                className="inline-flex items-center mt-auto text-sm font-bold text-amber-600 hover:text-amber-700 group"
              >
                Read Article
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="py-20 text-center border-2 border-gray-100 border-dashed rounded-xl bg-gray-50/50">
          <div className="flex justify-center mb-4">
            <Search className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No articles found</h3>
          <p className="mt-1 text-gray-500">
            We couldn't find any posts matching your search.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 mt-4 text-sm font-bold transition-colors rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogScreen;
