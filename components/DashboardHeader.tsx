import { Button } from "@/components/ui/button";
import Link from "next/link";

const DashboardHeader = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <h2 className="text-2xl font-bold text-purple-600">WaveX</h2>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/insights">
            <Button variant="outline">Insights</Button>
          </Link>
          <Link href="/analysis">
            <Button variant="outline">Analysis</Button>
          </Link>
          <Link href="https://www.lokicreatesai.me" target="_blank">
            <Button variant="outline">Help</Button>
          </Link>
          <Link href="/Form">
            <Button>Form</Button>
          </Link>
          <Link href="https://www.aipoweredtools.tech" target="_blank">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Get Noticed
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
