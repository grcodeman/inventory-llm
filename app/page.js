import TodoList from './components/TodoList.js';
import ChatBox from './components/ChatBox.js';

export default function Home() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '50%', borderRight: '1px solid #ccc' }}>
        <TodoList />
      </div>
      <div style={{ width: '50%' }}>
        <ChatBox />
      </div>
    </div>
  );
}
