import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../shared/form/Input";
import Select from "../shared/form/Select";
import Textarea from "../shared/form/Textarea";
import { IOption } from "../shared/form/SelectElement";
import Button from "../shared/Button";
import { FiX, FiSend } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

interface ISubmitProjectRequest {
  title: string;
  description: string;
  category: string;
  priority: string;
  estimated_budget: string;
  estimated_timeline: string;
  technical_requirements: string;
  contact_email: string;
  contact_telegram: string;
  submitter_name: string;
  tags: string;
}

interface SubmitProjectRequestProps {
  onClose: () => void;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const categories: IOption[] = [
  { id: "1", name: "Smart Contracts" },
  { id: "2", name: "DApps" },
  { id: "3", name: "Tools" },
  { id: "4", name: "Infrastructure" },
  { id: "5", name: "Gaming" },
  { id: "6", name: "DeFi" },
  { id: "7", name: "NFTs" },
  { id: "8", name: "AI" },
  { id: "9", name: "Mobile" },
  { id: "10", name: "Web" },
  { id: "11", name: "Analytics" },
  { id: "12", name: "Security" },
  { id: "13", name: "Education" },
  { id: "14", name: "Other" },
];

const priorityOptions: IOption[] = [
  { id: "1", name: "Low" },
  { id: "2", name: "Medium" },
  { id: "3", name: "High" },
  { id: "4", name: "Critical" },
];

const budgetOptions: IOption[] = [
  { id: "1", name: "Under $1,000" },
  { id: "2", name: "$1,000 - $5,000" },
  { id: "3", name: "$5,000 - $10,000" },
  { id: "4", name: "$10,000 - $25,000" },
  { id: "5", name: "$25,000 - $50,000" },
  { id: "6", name: "$50,000+" },
  { id: "7", name: "Open to discussion" },
  { id: "8", name: "No budget" },
];

const timelineOptions: IOption[] = [
  { id: "1", name: "1-2 weeks" },
  { id: "2", name: "1 month" },
  { id: "3", name: "2-3 months" },
  { id: "4", name: "3-6 months" },
  { id: "5", name: "6+ months" },
  { id: "6", name: "Flexible" },
];

export default function SubmitProjectRequest({ onClose }: SubmitProjectRequestProps) {
  const formMethods = useForm<ISubmitProjectRequest>();
  const { handleSubmit } = formMethods;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

  const submitProjectRequest = async (formData: ISubmitProjectRequest) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      // Convert tags string to array
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      // Convert IDs to names for database storage
      const categoryName = categories.find(cat => cat.id === formData.category)?.name || formData.category;
      const priorityName = priorityOptions.find(pri => pri.id === formData.priority)?.name || formData.priority;
      const budgetName = budgetOptions.find(bud => bud.id === formData.estimated_budget)?.name || formData.estimated_budget;
      const timelineName = timelineOptions.find(tim => tim.id === formData.estimated_timeline)?.name || formData.estimated_timeline;

      const { error } = await supabase.from("x_projects_requests").insert([
        {
          title: formData.title,
          description: formData.description,
          category: categoryName,
          priority: priorityName,
          estimated_budget: budgetName,
          estimated_timeline: timelineName,
          technical_requirements: formData.technical_requirements,
          contact_email: formData.contact_email,
          contact_telegram: formData.contact_telegram,
          submitter_name: formData.submitter_name,
          tags: tagsArray,
          status: "Open",
          votes: 0,
          vote_ips: [],
          interested_developers: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at: null,
        },
      ]);

      if (error) throw error;

      setSubmitStatus("success");
      formMethods.reset();
      setTimeout(() => { onClose(); }, 2000);

    } catch (error) {
      console.error("Error submitting project request:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 max-w-4xl w-full border border-theme-border/30 dark:border-theme-border-dark/30 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-title dark:text-theme-title-dark">
            Submit Project Request
          </h2>
          <button
            onClick={onClose}
            className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 text-sm text-blue-800 dark:text-blue-300">
          <p className="mb-2"><strong>Request a project to be built on MultiversX!</strong></p>
          <p>Have an idea for a project but need developers to build it? Submit your request here and let the community know what you&apos;d like to see built. Other users can vote on requests and developers can express interest in working on them.</p>
        </div>

        <AnimatePresence mode="wait">
          {submitStatus === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-green-600 dark:text-green-400 p-4 bg-green-100 dark:bg-green-900/50 rounded-md mb-4"
            >
              Project request submitted successfully! Thank you.
            </motion.div>
          ) : submitStatus === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-md mb-4"
            >
              Submission failed. Please try again.
            </motion.div>
          ) : null}
        </AnimatePresence>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(submitProjectRequest)} className="space-y-6 mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Fields marked with <span className="text-red-500">*</span> are required
            </div>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Project title"
                  name="title"
                  placeholder="e.g., NFT Marketplace for Digital Art"
                  type="text"
                  options={{ required: true }}
                />
              </div>

              <div>
                <Input
                  label="Your name"
                  name="submitter_name"
                  placeholder="Your full name"
                  type="text"
                  options={{ required: true }}
                />
              </div>
            </div>

            <div>
              <Textarea
                label="Project description"
                name="description"
                placeholder="Describe the project you&apos;d like to see built. Include key features, target audience, and any specific requirements..."
                options={{ required: true }}
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Category"
                  name="category"
                  options={{ required: true }}
                  selectOptions={categories}
                />
              </div>

              <div>
                <Select
                  label="Priority"
                  name="priority"
                  options={{ required: true }}
                  selectOptions={priorityOptions}
                />
              </div>
            </div>

            {/* Budget and Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Estimated budget"
                  name="estimated_budget"
                  options={{}}
                  selectOptions={budgetOptions}
                />
              </div>

              <div>
                <Select
                  label="Estimated timeline"
                  name="estimated_timeline"
                  options={{}}
                  selectOptions={timelineOptions}
                />
              </div>
            </div>

            {/* Technical Requirements */}
            <div>
              <Textarea
                label="Technical requirements"
                name="technical_requirements"
                placeholder="Specify any technical requirements, preferred technologies, integrations needed, etc."
                options={{}}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Contact email"
                  name="contact_email"
                  placeholder="your.email@example.com"
                  type="email"
                  options={{}}
                />
              </div>

              <div>
                <Input
                  label="Telegram handle"
                  name="contact_telegram"
                  placeholder="@yourusername"
                  type="text"
                  options={{}}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Input
                label="Tags"
                name="tags"
                placeholder="e.g., NFT, marketplace, art, trading (comma-separated)"
                type="text"
                options={{}}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-theme-text dark:text-theme-text-dark bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <Button
                label={isSubmitting ? "Submitting..." : "Submit Request"}
                icon={FiSend}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
} 