import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../../../shadcn/components/accordion"
  
  export function FAQAccordion() {
    return (
      <Accordion type="single" collapsible className="w-full -mt-2">
         <AccordionItem value="item-1">
        <AccordionTrigger>What is Juno?</AccordionTrigger>
          <AccordionContent>
          Juno allows you to browse, create, and seamlessly interact with tailor made AI.
          For more information, visit www.junoai.io/guide
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
        <AccordionTrigger>How do I interact with Juno?</AccordionTrigger>
          <AccordionContent>
          Navigate to the home tab, select a profile, press your interaction shortcut, and begin speaking. (Default shortcut: CTRL + SHIFT + S)
          
          Hold the shortcut to interact, release to stop, and press once to end the session. 
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>How do I add more profiles?</AccordionTrigger>
          <AccordionContent>
            Browse through or create your own profiles from scatch at www.junoai.io
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Is it free?</AccordionTrigger>
          <AccordionContent>
            Yes, to use Juno for free configure your own api keys in the Configuration tab.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>How can I avoid using my own API keys?</AccordionTrigger>
          <AccordionContent>
          If you would like to upgrade your plan to avoid using your own API keys, visit www.junoai.io/upgrade

          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>How can I see what my selected profile can do?</AccordionTrigger>
          <AccordionContent>
            To view your current profiles capabilites, click the details button on your selected profile
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  