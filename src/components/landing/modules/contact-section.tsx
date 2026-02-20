import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle } from "lucide-react";
import type { ContactConfig } from "@/lib/config/site-config-schema";

interface ContactSectionProps {
  readonly config: ContactConfig;
}

export function ContactSection({
  config,
}: ContactSectionProps): React.ReactElement {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="mb-12 text-3xl font-bold tracking-tight md:text-4xl">
        {config.heading}
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        {config.showForm && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input id="contact-name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  placeholder="How can we help?"
                  rows={4}
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {config.email && (
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Email</div>
                <a
                  href={`mailto:${config.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {config.email}
                </a>
              </div>
            </div>
          )}

          {config.discordInvite && (
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Discord</div>
                <a
                  href={config.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Join our Discord server
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
