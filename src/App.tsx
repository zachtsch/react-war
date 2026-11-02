import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type Profile = {
  username: string | null;
  avatar_url: string | null;
};

type Message = {
  id: number;
  content: string;
  user_id: string | null;
  profiles: Profile | null;
};

const MODERATOR_ID = import.meta.env.VITE_MODERATOR_USER_ID;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isModerator = Boolean(MODERATOR_ID && user?.id === MODERATOR_ID);

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        id,
        content,
        user_id,
        profiles!messages_profile_fkey (
          username,
          avatar_url
        )
      `,
      )
      .order("id", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setMessages(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (active) setUser(session?.user ?? null);
      },
    );

    void loadMessages();

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signIn() {
    setError(null);

    const redirectTo = window.location.origin + import.meta.env.BASE_URL;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo },
    });

    if (error) setError(error.message);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) setError(error.message);
  }

  async function postMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = content.trim();

    if (!user || !message || posting) return;

    setPosting(true);
    setError(null);

    const { error } = await supabase
      .from("messages")
      .insert({ content: message });

    if (error) {
      setError(error.message);
    } else {
      setContent("");
      await loadMessages();
    }

    setPosting(false);
  }

  async function deleteMessage(message: Message) {
    if (!user || deletingId !== null) return;

    const isOwner = message.user_id === user.id;

    if (!isOwner && !isModerator) return;

    const confirmation = window.confirm(
      isOwner
        ? "Delete your message?"
        : `Super Delete this message from ${
            message.profiles?.username ?? "Guest"
          }?`,
    );

    if (!confirmation) return;

    setDeletingId(message.id);
    setError(null);

    const { data, error } = await supabase
      .from("messages")
      .delete()
      .eq("id", message.id)
      .select("id");

    if (error) {
      setError(error.message);
    } else if (!data || data.length === 0) {
      setError("Message was not deleted. Check permissions.");
    } else {
      await loadMessages();
    }

    setDeletingId(null);
  }

  return (
    <main
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 20,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header>
        <h1>Guestbook</h1>

        {user ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {user.user_metadata.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
              />
            )}

            <strong>
              {user.user_metadata.user_name ?? user.email ?? "User"}
            </strong>

            {isModerator && <span>⭐ Moderator</span>}

            <button onClick={signOut}>Sign out</button>
          </div>
        ) : (
          <button onClick={signIn}>Sign in with GitHub</button>
        )}
      </header>

      <hr style={{ margin: "24px 0" }} />

      {error && (
        <p role="alert" style={{ color: "crimson" }}>
          Error: {error}
        </p>
      )}

      {user ? (
        <form onSubmit={postMessage}>
          <h2>Leave a message</h2>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            maxLength={500}
            rows={4}
            required
            style={{
              width: "100%",
              padding: 10,
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={posting || !content.trim()}
            style={{ marginTop: 10 }}
          >
            {posting ? "Posting..." : "Post message"}
          </button>
        </form>
      ) : (
        <p>Sign in with GitHub to leave a message.</p>
      )}

      <hr style={{ margin: "24px 0" }} />

      <h2>Messages</h2>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {messages.map((message) => {
            const isOwner = Boolean(user && message.user_id === user.id);

            const canDelete = isOwner || isModerator;
            const isSuperDelete = isModerator && !isOwner;

            return (
              <article
                key={message.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {message.profiles?.avatar_url && (
                    <img
                      src={message.profiles.avatar_url}
                      alt=""
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%" }}
                    />
                  )}

                  <strong>{message.profiles?.username ?? "Guest"}</strong>
                </div>

                <p>{message.content}</p>

                {canDelete && (
                  <button
                    type="button"
                    onClick={() => deleteMessage(message)}
                    disabled={deletingId !== null}
                    style={{
                      color: isSuperDelete ? "crimson" : "inherit",
                      marginTop: 8,
                      cursor: "pointer",
                    }}
                  >
                    {deletingId === message.id
                      ? "Deleting..."
                      : isSuperDelete
                        ? "Super Delete"
                        : "Delete"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default App;
