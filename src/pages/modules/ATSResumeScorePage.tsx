import { useNavigate } from "react-router-dom";
import { FileSearch } from "lucide-react";
import ModulePageLayout from "@/components/modules/ModulePageLayout";

const ATSResumeScorePage = () => {
  const navigate = useNavigate();

  return (
    <ModulePageLayout
      title="ATS Resume Score"
      description="Check your resume's ATS compatibility score"
      icon={<FileSearch className="w-5 h-5 text-primary-foreground" />}
      data={[]}
      loading={false}
      searchKeys={[]}
      columns={[
        { key: "id" as any, label: "Info", render: () => "Use the AI assistant to check your resume's ATS score. Click 'Ask Intervixa AI' to get started." },
      ]}
    />
  );
};

export default ATSResumeScorePage;
