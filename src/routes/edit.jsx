import { Form, useLoaderData,  redirect,useNavigate,
} from "react-router-dom";
import { updateContact } from "../contacts";
import ReactGA from 'react-ga4';

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const { contact } = useLoaderData();
  const navigate = useNavigate();
  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact?.first}
          onBlur={(event) => {
            const value = event.currentTarget.value;
            if (value) {
              ReactGA.event({
                category: `value: ${value}`,
                action: "onBlur",
                label: "first name",
                transport: "beacon"
              })
            }
          }}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact?.last}
          onBlur={(event) => {
            const value = event.currentTarget.value;
            if (value) {
              ReactGA.event({
                category: `value: ${value}`,
                action: "onBlur",
                label: "last name",
                transport: "beacon"
              })
            }
          }}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact?.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact?.avatar}
          onBlur={(event) => {
            const value = event.currentTarget.value;
            if (value) {
              ReactGA.event({
                category: `value: ${value}`,
                action: "onBlur",
                label: "avatar",
                transport: "beacon"
              })
            }
          }}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact?.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button"           onClick={() => {
            navigate(-1);
          }}>Cancel</button>
      </p>
    </Form>
  );
}
