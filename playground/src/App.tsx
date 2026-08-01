import { useState } from 'react';
import { Modal } from './components/custom/Modal';
import { Tabs } from './components/custom/Tabs';
import { Disclosure } from './components/custom/Disclosure';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Component Playground</h1>
          <p className="text-gray-500 mb-8">Testing hand-rolled W3C ARIA accessible components.</p>
        </div>

        {/* Modal Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Modal (Dialog)</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Open Modal
          </button>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Interactive ARIA Modal"
          >
            <p className="text-gray-600 mb-4">
              This modal traps focus. Try pressing <kbd className="px-1 bg-gray-100 border rounded">Tab</kbd> to cycle through elements, and <kbd className="px-1 bg-gray-100 border rounded">Escape</kbd> to close.
            </p>
            <input 
              type="text" 
              placeholder="Focusable input" 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Modal>
        </section>

        {/* Tabs Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Tabs</h2>
          <Tabs
            tabs={[
              { id: 'tab1', label: 'Overview', content: <p className="text-gray-600">Overview content. Use arrow keys to navigate tabs.</p> },
              { id: 'tab2', label: 'Settings', content: <p className="text-gray-600">Settings panel. Roving tabindex ensures focus moves correctly.</p> },
              { id: 'tab3', label: 'Advanced', content: <p className="text-gray-600">Advanced features. Home/End keys also work for rapid navigation.</p> }
            ]}
          />
        </section>

        {/* Disclosure Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Disclosure (Accordion)</h2>
          <Disclosure title="Why is accessibility important?">
            <p className="text-gray-600">
              Accessibility ensures that web applications are usable by everyone, including people with disabilities relying on screen readers or keyboard navigation.
            </p>
          </Disclosure>
        </section>
      </div>
    </div>
  );
}

export default App;
