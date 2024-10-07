import {NavLink, Outlet,useLoaderData, redirect, Form,useNavigation, useSubmit, useLocation} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { container } from "../main";
import {useEffect} from "react";
import ReactGA from "react-ga4";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({request}) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

// eslint-disable-next-line react-refresh/only-export-components
export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  const location = useLocation();
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  // // Send pageview with a custom path
  // ReactGA.send({ hitType: "pageview", page: "/root layout", title: "Demo app for React Router" });

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location.pathname]);

  return (
    <>
      <div id="sidebar">
        <h1>Example website</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {

                // Send a custom event
                ReactGA.event({
                  category: "Search",
                  action: "onChange",
                  label: "search", // optional
                  transport: "beacon"
                });

                const isFirstSearch = q === null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
              className={searching ? "loading" : ""}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit" onClick={()=>{
              // Send a custom event
              ReactGA.event({
                category: "Button",
                action: "onClick",
                label: "New",
                transport: "beacon"
              });
            }}>New</button>
          </Form>
        </div>
        <nav>
        {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink to={`contacts/${contact.id}`}
                   className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
        <div style={container}>
          <Outlet />
        </div>
      </div>
    </>
  );
}