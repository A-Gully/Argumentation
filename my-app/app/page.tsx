import GraphInputForm from "./graph-input-form";
import LogicGraphInputForm from "./logic-graph-input-form";

export default function Home() {
  return (
    <main>
      <div className="header">
        <img
          className="logo"
          src="./favicon.ico"
          width={100}
          height={100}
        ></img>
        <h1>ArguLab</h1>
      </div>
      <div className="forms">
        <ul className="forms">
          <li className="forms1">
            <h2>Logic:</h2>
            <LogicGraphInputForm />
          </li>
          <li className="forms">
            <div className="vl"></div>
          </li>
          <li className="forms2">
            <h2>Relations:</h2>
            <GraphInputForm />
          </li>
        </ul>
      </div>
    </main>
  );
}
