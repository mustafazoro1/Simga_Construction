import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { useSubmitContactForm } from "@workspace/api-client-react";
import ReCAPTCHA from "react-google-recaptcha";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters.")
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [verified, setVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  // Honeypot — real users leave this blank, naive bots fill it.
  const [website, setWebsite] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });

  const submitMutation = useSubmitContactForm({
    mutation: {
      onSuccess: () => {
        toast.success("Message sent successfully", {
          description: "Thank you for reaching out. Our team will get back to you shortly.",
        });
        form.reset();
        setVerified(false);
      },
      onError: (error) => {
        toast.error("Something went wrong", {
          description: error instanceof Error ? error.message : "Please try again in a moment.",
        });
      },
    },
  });

  function onSubmit(values: FormValues) {
    if (website.trim() !== "") {
      // Bot trap — silently drop.
      return;
    }
    if (!verified || !recaptchaToken) {
      toast.error("Please complete the human check first.");
      return;
    }
    submitMutation.mutate({ data: { ...values, recaptchaToken } as any });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 md:p-10 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-serif text-foreground/80">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" className="bg-background border-border rounded-none h-12 focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-serif text-foreground/80">Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" className="bg-background border-border rounded-none h-12 focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-serif text-foreground/80">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+92 300 0000000" className="bg-background border-border rounded-none h-12 focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-serif text-foreground/80">Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Project Inquiry" className="bg-background border-border rounded-none h-12 focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-serif text-foreground/80">Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your project or inquiry..."
                  className="bg-background border-border rounded-none min-h-[150px] resize-y focus-visible:ring-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot — visually hidden but accessible to bots */}
        <div aria-hidden="true" className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden">
          <label>
            Website (leave blank)
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
        </div>

        {/* Real reCAPTCHA */}
        <ReCAPTCHA
          sitekey="6LeivNUsAAAAADG-aXPFZRSBGgzRNlcLt5Py2Gq8"
          onChange={(token) => {
            setVerified(!!token);
            setRecaptchaToken(token);
          }}
        />

        <Button
          type="submit"
          disabled={submitMutation.isPending || !verified}
          className="w-full md:w-auto px-8 h-14 text-lg font-semibold rounded-none bg-primary hover:bg-primary/90 text-white gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {verified ? "Send Message" : "Verify to send"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
