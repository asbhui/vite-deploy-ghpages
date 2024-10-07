import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";
import ReactGA from 'react-ga4';

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
}
// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request, params }) {
  const formData = await request.formData();
  return await updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
  const { contact } = useLoaderData();
  // const contact = {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://robohash.org/you.png?size=200x200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={
            contact.avatar ||
            `https://robohash.org/${contact.id}.png?size=200x200`
          }
          alt="avatar"
          onClick={() =>
            ReactGA.event({
              category: "Avatar",
              action: "onClick",
              label: "avatar",
              transport: "image"
            })}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit" onClick={() =>
                ReactGA.event({
                  category: "Edit contact",
                  action: "onClick",
                  label: "edit contact button",
                  transport: "beacon"
                })}>Edit</button>
          </Form>

          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" onClick={() => {
                ReactGA.event({
                  category: "Delete contact",
                  action: "onClick",
                  label: "delete contact button",
                  transport: "beacon"
                })
            }}>Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function Favorite({ contact }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
  ? fetcher.formData.get("favorite") === "true"
  // eslint-disable-next-line react/prop-types
  : contact?.favorite;
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        onClick={() =>
          ReactGA.event({
            category: `Favorite contact: ${favorite ? "false" : "true"}`,
            action: "onClick",
            label: "favorite contact button",
            transport: "beacon"
          })}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
