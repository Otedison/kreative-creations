import { Twitter, Linkedin, Facebook, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-2 text-muted-foreground text-sm">
        <Share2 className="w-4 h-4" />
        Share:
      </span>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShare("twitter")}
          className="h-9 w-9 rounded-full hover:bg-accent/10 hover:text-accent"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShare("linkedin")}
          className="h-9 w-9 rounded-full hover:bg-accent/10 hover:text-accent"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShare("facebook")}
          className="h-9 w-9 rounded-full hover:bg-accent/10 hover:text-accent"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
