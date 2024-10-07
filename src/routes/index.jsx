import ReactGA from 'react-ga4';

export default function Index() {
  // Send a custom event
  ReactGA.event({
    category: "Landing page",
    action: "Landing page shown",
    transport: "beacon"
  });
  return (
    <p id="zero-state" >
      This is a demo for React Router. {import.meta.env.VITE_GA_MEASUREMENT_ID}
      <br />
      Check out{" "}
      <a href="https://reactrouter.com">
        the docs at reactrouter.com
      </a>
      .
    </p>
  );
}