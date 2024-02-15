import Image from "next/image";
import GraphInputForm from "./graph-input-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Argument Labelling</h1>
      <div>
        <GraphInputForm />
      </div>
    </main>
  );
}
