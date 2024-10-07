import { useRouteError } from "react-router-dom";
import ReactGA from 'react-ga4';


export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  // Send a custom event
  ReactGA.event({
    category: `Error: ${error.name}`,
    action: "view error page",
    label: "Error page shown", // optional
    transport: "beacon"
  });

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}