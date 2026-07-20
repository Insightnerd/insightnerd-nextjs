export default function ContactPage() {
  return (
    <div className="max-w-full">
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p>
              We value your feedback, questions, and suggestions. Whether you have ideas for new articles, want to contribute content, or just have questions about anything on InsightNerd, we'd love to hear from you.
            </p>
            <p>
              Being a relatively new publication, we're especially interested in hearing from:
            </p>
            <ul>
              <li>Technical writers who want to share their expertise</li>
              <li>Developers and data scientists with practical content to share</li>
              <li>Readers who want to improve existing articles</li>
              <li>Collaborators interested in joining our team</li>
            </ul>
            <p>
              While we don't currently offer professional writing services, we're always open to discussing collaborations that add real value to our community.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 border">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Email</h3>
                <p className="text-muted-foreground">collaborations@insightnerd.in</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Community</h3>
                <p className="text-muted-foreground mb-2">
                  Join our community discussions on GitHub to suggest articles, share feedback, and connect with other readers.
                </p>
                <a
                  href="https://github.com/insightnerd-insider"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  github.com/insightnerd-insider
                </a>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Social Media</h3>
                <p className="text-muted-foreground mb-2">
                  Follow us on X/Twitter for updates and behind-the-scenes content.
                </p>
                <a
                  href="https://x.com/insightnerd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  @insightnerd
                </a>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Submission Guidelines</h3>
                <p className="text-muted-foreground">
                  If you're interested in submitting an article, please DM us on X with:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Your name and background</li>
                  <li>• Article topic and outline</li>
                  <li>• Estimated word count and timeline</li>
                  <li>Any relevant links or references</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
