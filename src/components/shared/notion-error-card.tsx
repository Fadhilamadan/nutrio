import { ErrorCard } from "@/components/ui/error-card";

type NotionErrorCardProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function NotionErrorCard({ title = "Cannot connect to Notion", message, onRetry }: NotionErrorCardProps) {
  return (
    <ErrorCard
      title={title}
      message={message}
      detail="Check env vars, Notion database IDs, schema fields, and whether each database is shared with the integration."
      onRetry={onRetry}
    />
  );
}
