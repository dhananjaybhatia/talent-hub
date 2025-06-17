import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import { Link } from "react-router-dom";
import companies from "../data/companies.json";
import faqs from "../data/faqs.json";
import Autoplay from "embla-carousel-autoplay";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold uppercase gradient-title tracking-tight">
          From Dream to Offer <br /> Talent Hub Makes It Real
        </h1>
        <p className="subheading">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>
      <div className="flex justify-center mt-10 gap-6">
        <Link to="/jobs">
          <Button
            className="bg-[#118ab2] hover:bg-[#0d6c8f] text-amber-50 p-8"
            size={"xl"}
          >
            Find Jobs
          </Button>
        </Link>
        <Link to="/post-job">
          <Button
            className="bg-[#ef476f] hover:bg-[#d93a5d] text-amber-50 p-8"
            size={"xl"}
          >
            Post Jobs
          </Button>
        </Link>
      </div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full py-10"
      >
        <CarouselContent className={"flex gap-5 sm:gap-20 items-center"}>
          {companies.map(({ name, id, path }) => {
            return (
              <CarouselItem key={id} className={"basis-1/3 lg:basis-1/6"}>
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <img src="public/banner.jpeg" className="w-full" />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className={"card-title"}>Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="card-description">
              Find jobs that match your skills, apply instantly, and track your
              progress.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={"card-title"}>Talent Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="card-description">
              Post openings, browse qualified candidates, and hire the right.
              talent
            </p>
          </CardContent>
        </Card>
      </section>
      <Accordion type="single" collapsible>
        {faqs.map(({ question, answer }, index) => {
          return (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </main>
  );
};

export default LandingPage;
