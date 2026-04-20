import React, { useState, useEffect } from 'react';
import styles from './MessagesPage.module.css';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, or } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);

export default function MessagesPage({ user }) {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (!user) return;

    // Fetch messages where user is either sender or recipient
    const q = query(
      collection(db, "notifications"),
      or(
        where("recipientEmail", "==", user.email),
        where("senderEmail", "==", user.email)
      )
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => a.createdAt?.toMillis() - b.createdAt?.toMillis()); // Sort chronological for chat view

      setMessages(allMsgs);

      // Group by conversation
      const grouped = {};
      allMsgs.forEach(msg => {
        // The "other" person in the chat
        const otherPerson = msg.senderEmail === user.email ? msg.recipientEmail : msg.senderEmail;
        if (!grouped[otherPerson]) {
          grouped[otherPerson] = {
            contact: otherPerson,
            messages: [],
            unread: 0,
            lastMessageAt: msg.createdAt?.toMillis() || 0,
            lastMessage: msg.message
          };
        }
        grouped[otherPerson].messages.push(msg);
        grouped[otherPerson].lastMessage = msg.message;
        grouped[otherPerson].lastMessageAt = msg.createdAt?.toMillis() || 0;
        
        if (msg.recipientEmail === user.email && !msg.read) {
          grouped[otherPerson].unread += 1;
        }
      });

      // Convert object to array and sort by most recent
      const convosArray = Object.values(grouped).sort((a, b) => b.lastMessageAt - a.lastMessageAt);
      setConversations(convosArray);
      
      // Update active chat if it exists
      if (activeChat) {
        const updatedChat = convosArray.find(c => c.contact === activeChat.contact);
        if (updatedChat) setActiveChat(updatedChat);
      }
    });

    return () => unsubscribe();
  }, [user, activeChat]);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    // Mark messages from this contact as read
    chat.messages.forEach(async (msg) => {
      if (msg.recipientEmail === user.email && !msg.read) {
        try {
          await updateDoc(doc(db, "notifications", msg.id), { read: true });
        } catch (err) {
          console.error("Error marking read:", err);
        }
      }
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat) return;

    try {
      await addDoc(collection(db, "notifications"), {
        recipientEmail: activeChat.contact,
        senderEmail: user.email,
        message: replyText,
        read: false,
        createdAt: new Date()
      });
      setReplyText('');
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Messages</h2>
          </div>
          <div className={styles.conversationList}>
            {conversations.length === 0 ? (
              <div className={styles.emptyState}>No conversations yet.</div>
            ) : (
              conversations.map(chat => (
                <div 
                  key={chat.contact} 
                  className={`${styles.chatCard} ${activeChat?.contact === chat.contact ? styles.activeCard : ''}`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className={styles.avatar}>
                    {chat.contact.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.chatInfo}>
                    <div className={styles.chatTop}>
                      <h4>{chat.contact}</h4>
                    </div>
                    <p className={styles.lastMessage}>{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && <span className={styles.unreadBadge}>{chat.unread}</span>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.chatArea}>
          {activeChat ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.avatar}>
                  {activeChat.contact.charAt(0).toUpperCase()}
                </div>
                <h3>{activeChat.contact}</h3>
              </div>
              
              <div className={styles.messagesWindow}>
                {activeChat.messages.map(msg => {
                  const isMine = msg.senderEmail === user.email;
                  return (
                    <div key={msg.id} className={`${styles.messageWrapper} ${isMine ? styles.mine : styles.theirs}`}>
                      <div className={styles.messageBubble}>
                        <p>{msg.message}</p>
                        <span className={styles.timestamp}>{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form className={styles.inputArea} onSubmit={handleSend}>
                <input 
                  type="text" 
                  className={styles.messageInput} 
                  placeholder="Type a message..." 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button type="submit" className={styles.sendBtn} disabled={!replyText.trim()}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className={styles.noChatSelected}>
              <div className={styles.noChatIcon}>💬</div>
              <h3>Your Messages</h3>
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
