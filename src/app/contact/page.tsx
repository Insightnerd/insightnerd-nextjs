import { ContentPageAnimations } from "@/components/ContentPageAnimations";
import { Mail, MessageCircle, ExternalLink, Sparkles, FileText } from "lucide-react";

export default function ContactPage() {
  return (
    <ContentPageAnimations>
    <div className="max-w-full">
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            Contact
          </div>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground mb-10">
            We value your feedback, questions, and suggestions.
          </p>

          <div className="prose prose-lg prose-invert max-w-none mb-10">
            <p>
              Whether you have ideas for new articles, want to contribute content, or just have questions about anything on InsightNerd, we&apos;d love to hear from you.
            </p>
            <p>
              Being a relatively new publication, we&apos;re especially interested in hearing from technical writers, developers, and data scientists with practical content to share.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <a
              href="mailto:insightnerd@outlook.com"
              className="flex items-start gap-4 rounded-xl border border-border bg-muted p-5 hover:border-primary/30 transition-colors group"
            >
              <div className="shrink-0 rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Email</h3>
                <p className="text-xs text-muted-foreground mt-1 break-all">insightnerd@outlook.com</p>
              </div>
            </a>
            <a
              href="https://github.com/insightnerd-insider"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-xl border border-border bg-muted p-5 hover:border-primary/30 transition-colors group"
            >
              <div className="shrink-0 rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Community</h3>
                <p className="text-xs text-muted-foreground mt-1">Join discussions on GitHub</p>
                <span className="text-xs text-primary inline-flex items-center gap-1 mt-1">
                  github.com/insightnerd-insider <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
            <a
              href="https://x.com/insightnerd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-xl border border-border bg-muted p-5 hover:border-primary/30 transition-colors group"
            >
              <div className="shrink-0 rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Social Media</h3>
                <p className="text-xs text-muted-foreground mt-1">Follow for updates</p>
                <span className="text-xs text-primary inline-flex items-center gap-1 mt-1">
                  @insightnerd <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
            <div className="flex items-start gap-4 rounded-xl border border-border bg-muted p-5">
              <div className="shrink-0 rounded-lg bg-primary/10 p-2.5">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Submissions</h3>
                <p className="text-xs text-muted-foreground mt-1">DM us on X with your topic, outline, and timeline</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </ContentPageAnimations>
  );
}
