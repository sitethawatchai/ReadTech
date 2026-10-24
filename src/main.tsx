import { createRoot } from 'react-dom/client';
import '@fontsource/sarabun/400.css';
import '@fontsource/sarabun/600.css';
import '@fontsource/sarabun/700.css';
import './openStyles.css';
import OpenApp from './OpenApp';
createRoot(document.getElementById('root')!).render(<OpenApp/>);
