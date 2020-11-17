import React, { useState } from 'react';
import Questao from './Questao';

const files = ['questao1.json', 'questao2.json', 'questao3.json', 'questao4.json', 'questao5.json'];

function App() {

  const [index, setIndex] = useState(0);

  const nextFile = () => {
    const nextIndex = index === files.length - 1 ? 0 : index + 1;
    setIndex(nextIndex);
  }

  return (
    <div className="app">
      <Questao file={files[index]} nextFile={nextFile} />
    </div>
  );
}

export default App;
