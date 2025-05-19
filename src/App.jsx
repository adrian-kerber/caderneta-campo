import { useState, useEffect } from 'react';
import './App.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


function App() {
  const [data, setData] = useState('');
  const [atividade, setAtividade] = useState('');
  const [produto, setProduto] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [registros, setRegistros] = useState([]);

  // Carregar registros salvos do localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('registros');
    if (dadosSalvos) {
      setRegistros(JSON.parse(dadosSalvos));
    }
  }, []);

  // Salvar no localStorage sempre que os registros mudarem
  useEffect(() => {
    localStorage.setItem('registros', JSON.stringify(registros));
  }, [registros]);

  const adicionarRegistro = (e) => {
    e.preventDefault();

    if (!data || !atividade) {
      alert('Data e tipo de atividade são obrigatórios!');
      return;
    }

    const novoRegistro = {
      id: Date.now(),
      data,
      atividade,
      produto,
      observacoes,
    };

    setRegistros([novoRegistro, ...registros]);

    // Limpar campos
    setData('');
    setAtividade('');
    setProduto('');
    setObservacoes('');
  };

  const removerRegistro = (id) => {
    const atualizados = registros.filter(reg => reg.id !== id);
    setRegistros(atualizados);
  };

  const exportarPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setTextColor(46, 125, 50);
  doc.text('Registro de Atividades no Campo', 105, 15, { align: 'center' });

  const dataTabela = registros.map((reg, i) => [
    i + 1,
    reg.data,
    reg.atividade,
    reg.produto || '-',
    reg.observacoes || '-',
  ]);

  autoTable(doc, {
    head: [['#', 'Data', 'Atividade', 'Produto', 'Observações']],
    body: dataTabela,
    startY: 25,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [46, 125, 50],
      textColor: 255,
      halign: 'center',
    },
  });

  doc.save('registro-atividades.pdf');
};

  return (
    <div className="container">
      <h1>🌾 Registro de Atividades de Campo</h1>

      <form onSubmit={adicionarRegistro}>
        <div>
          <label>Data:</label>
          <input type="date" value={data} onChange={e => setData(e.target.value)} required />
        </div>

        <div>
          <label>Tipo de atividade:</label>
          <input
            type="text"
            placeholder="Ex: plantio, colheita..."
            value={atividade}
            onChange={e => setAtividade(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Produto (opcional):</label>
          <input
            type="text"
            value={produto}
            onChange={e => setProduto(e.target.value)}
          />
        </div>

        <div>
          <label>Observações:</label>
          <textarea
            rows="3"
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
          />
        </div>
        <div className="regbutton">
           <button type="submit">Registrar</button>
        </div>
                
      </form>

      <h2>📋 Registros</h2>
      {registros.length > 0 && (
          <div className="regbutton" style={{ marginBottom: '2rem' }}>
            <button onClick={exportarPDF}>Exportar PDF</button>
          </div>
        )}
      {registros.length === 0 && <p style={{ textAlign: 'center' }}>Nenhuma atividade registrada ainda.</p>}
      <ul>
        {registros.map(reg => (
          <li key={reg.id}>
            <p><strong>Data:</strong> {reg.data}</p>
            <p><strong>Atividade:</strong> {reg.atividade}</p>
            {reg.produto && <p><strong>Produto:</strong> {reg.produto}</p>}
            {reg.observacoes && <p><strong>Obs:</strong> {reg.observacoes}</p>}
            <button onClick={() => removerRegistro(reg.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
