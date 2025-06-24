import styles from './message-bubble.module.css';

interface IMessageBubbleProps {
    type: 'incoming' | 'outgoing';
    text: string;
}
export default function MessageBubble({
    type,
    text
}: IMessageBubbleProps) {
    const afterMessagePadding = "10%";

    return (
        <div className={styles.message}
            style={type === "outgoing" ?
                {
                    justifyContent: 'right',
                    paddingLeft: afterMessagePadding,
                }
                :
                {
                    justifyContent: 'left',
                    paddingRight: afterMessagePadding,
                }
                
            }
        >
            <p className={styles.messageText}
                style={{
                    backgroundColor: type === 'incoming' ? 'lightgrey' : 'lightblue'
                }}
            >{text}</p>
        </div>
    )
}
