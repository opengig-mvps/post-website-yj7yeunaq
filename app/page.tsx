'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Star, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 bg-gradient-to-br from-green-200 to-green-400">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl text-white">
                    Anonymous Nested Post System
                  </h1>
                  <p className="max-w-[600px] text-white md:text-xl">
                    Create and view anonymous posts with nested replies. Build a hierarchical thread of comments without user authentication.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-white text-green-500">Get Started</Button>
                  <Button variant="outline" className="border-white text-white">Learn More</Button>
                </div>
              </div>
              <img
                src="https://picsum.photos/seed/picsum/200/300"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Explore the various features of our nested post system.
                </p>
              </div>
            </div>
            <div className="grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12 mx-auto">
              <Card className="flex flex-col items-center justify-center space-y-4">
                <MessageSquare className="h-12 w-12 text-green-500" />
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-bold">Anonymous Posting</h3>
                  <p className="text-muted-foreground">Create posts and replies without user authentication.</p>
                </div>
              </Card>
              <Card className="flex flex-col items-center justify-center space-y-4">
                <Star className="h-12 w-12 text-green-500" />
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-bold">Nested Replies</h3>
                  <p className="text-muted-foreground">Organize comments in a hierarchical thread.</p>
                </div>
              </Card>
              <Card className="flex flex-col items-center justify-center space-y-4">
                <Check className="h-12 w-12 text-green-500" />
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-bold">Like/Dislike System</h3>
                  <p className="text-muted-foreground">Enable users to like or dislike posts and comments.</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">User Feedback</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Hear from our users about their experience with our nested post system.
                </p>
              </div>
              <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                <Card className="flex flex-col items-start space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs text-muted-foreground">User</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "This nested post system is amazing! The ability to create and view hierarchical comments is very useful."
                  </p>
                </Card>
                <Card className="flex flex-col items-start space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">Sarah Miller</p>
                      <p className="text-xs text-muted-foreground">User</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "I love the anonymous posting feature. It allows me to freely express my thoughts without revealing my identity."
                  </p>
                </Card>
                <Card className="flex flex-col items-start space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">Michael Johnson</p>
                      <p className="text-xs text-muted-foreground">User</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "The like/dislike system is great. It helps me gauge the popularity of my posts and comments."
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 p-6 md:py-12 w-full text-white">
        <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
          <div className="grid gap-1">
            <h3 className="font-semibold">Product</h3>
            <a href="#">Features</a>
            <a href="#">Integrations</a>
            <a href="#">Pricing</a>
            <a href="#">Security</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Company</h3>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Resources</h3>
            <a href="#">Documentation</a>
            <a href="#">Help Center</a>
            <a href="#">Community</a>
            <a href="#">Templates</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Legal</h3>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;