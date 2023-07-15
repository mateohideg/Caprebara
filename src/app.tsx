import { useState } from 'preact/hooks';

interface Data {
  periodo: number;
  pago: number;
  interes: number
  amortizacion: number
  saldo: number;
}

export function App() {
  const [finalData, setFinalData] = useState<Data[]>([]);
  const [importeString, setImporteString] = useState('');
  const [tasaString, setTasaString] = useState('');
  const [duracionString, setDuracionString] = useState('');
  const [decimalesString, setDecimalesString] = useState('2');
  const [selectedSistema, setSelectedSistema] = useState('frances');
  const [selectedCalculo, setSelectedCalculo] = useState('exacto');

  return (
    <>
    <p class="text-2xl mb-2 md:hidden">Tabla</p>
      {finalData.length > 0 ? <div class="w-full mr-8 mb-8 md:mb-0 rounded-xl border border-slate-200 overflow-scroll">
        <table class="table-auto w-full h-full">
          <thead class="bg-slate-200">
            <tr>
              <th class="p-2">Período</th>
              <th class="p-2">Pago</th>
              <th class="p-2">Interés</th>
              <th class="p-2">Amortización</th>
              <th class="p-2">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {finalData.map((x, i) => <tr class={i % 2 === 1 ? 'bg-slate-100' : '-'}>
              <td class="p-2">{!Number.isNaN(x.periodo) ? x.periodo.toFixed(0) : '-'}</td>
              <td class="p-2">{!Number.isNaN(x.pago) ? x.pago.toFixed(Number(decimalesString)) : '-'}</td>
              <td class="p-2">{!Number.isNaN(x.interes) ? x.interes.toFixed(Number(decimalesString)) : '-'}</td>
              <td class="p-2">{!Number.isNaN(x.amortizacion) ? x.amortizacion.toFixed(Number(decimalesString)) : '-'}</td>
              <td class="p-2">{!Number.isNaN(x.saldo) ? x.saldo.toFixed(Number(decimalesString)) : '-'}</td>
            </tr>)}
          </tbody>
        </table>
      </div> : <div class="w-full h-64 md:h-auto mr-8 mb-8 md:mb-0 rounded-xl border border-slate-200 flex justify-center items-center text-center">
        <p class="text-2xl">Por favor, complete el formulario.</p>
      </div>}
      <p class="text-2xl mb-2 md:hidden">Formulario</p>
      <div class="flex flex-col">
        <label for="importe">Importe:</label>
        <input type="text" inputMode="numeric" onKeyPress={(e) => !/[0-9|.]/.test(e.key) && e.preventDefault()} id="importe" value={importeString} onChange={x => setImporteString(x.currentTarget.value)} class="p-2 border border-slate-200 rounded-xl box-border h-12 mb-4" />

        <label for="tasa">Tasa de interés (porcentaje):</label>
        <input type="text" inputMode="numeric" onKeyPress={(e) => !/[0-9|.]/.test(e.key) && e.preventDefault()} id="tasa" value={tasaString} onChange={x => setTasaString(x.currentTarget.value)} class="p-2 border border-slate-200 rounded-xl box-border h-12 mb-4" />

        <label for="duracion">Duración (periodos):</label>
        <input type="text" inputMode="numeric" onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} id="duracion" value={duracionString} onChange={x => setDuracionString(x.currentTarget.value)} class="p-2 border border-slate-200 rounded-xl box-border h-12 mb-4" />

        <label for="sistema">Sistema:</label>
        <select id="sistema" value={selectedSistema} onChange={x => setSelectedSistema(x.currentTarget.value)} class="p-2 border border-slate-200 rounded-xl bg-white box-border h-12 mb-4">
          <option value="frances">Francés</option>
          <option value="aleman">Alemán</option>
        </select>

        <label for="decimales">Cantidad decimales (tabla):</label>
        <input type="text" inputMode="numeric" onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} id="decimales" value={decimalesString} onChange={x => setDecimalesString(x.currentTarget.value)} class="p-2 border border-slate-200 rounded-xl box-border h-12 mb-4" />

        <label for="calculo">Cálculo (interno):</label>
        <select id="calculo" value={selectedCalculo} onChange={x => setSelectedCalculo(x.currentTarget.value)} class="p-2 border border-slate-200 rounded-xl bg-white box-border h-12 mb-2">
          <option value="exacto">Exacto</option>
          <option value="redondo">Redondo</option>
        </select>
        <p class="mb-4">Nota: Utilizar un cálculo redondo dará resultados cercanos pero incorrectos.</p>

        <button class="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 focus:bg-slate-50 active:bg-slate-100 box-border h-12" onClick={() => {
          const importe = Number(importeString);
          const tasa = Number(tasaString) / 100;
          const duracion = Number(duracionString);

          const finishedArray: Data[] = [];

          for (let currentIndex = 0; currentIndex <= duracion; currentIndex++) {
            const returno = {
              periodo: currentIndex,
              pago: NaN,
              interes: NaN,
              amortizacion: NaN,
              saldo: NaN
            }

            if (currentIndex > 0) {

              if (selectedSistema === 'frances') {
                returno.pago = processNumber((importe * tasa) / (1 - (1 + tasa) ** -duracion));

                returno.interes = processNumber((finishedArray[currentIndex - 1].saldo * (1 + tasa)) - finishedArray[currentIndex - 1].saldo);

                returno.amortizacion = processNumber(returno.pago - returno.interes);

                returno.saldo = processNumber(finishedArray[currentIndex - 1].saldo - returno.amortizacion);
              } else if (selectedSistema === 'aleman') {
                returno.amortizacion = processNumber(importe / duracion);

                returno.saldo = processNumber(finishedArray[currentIndex - 1].saldo - returno.amortizacion);

                returno.interes = processNumber(finishedArray[currentIndex - 1].saldo * (1 + tasa) - finishedArray[currentIndex - 1].saldo);

                returno.pago = processNumber(returno.amortizacion + returno.interes);
              }
            } else {
              returno.saldo = processNumber(importe);
            }

            finishedArray.push(returno);
          }

          setFinalData(finishedArray);
        }}>Calcular</button>
      </div>
    </>
  );

  function processNumber(x: number) {
    if (selectedCalculo === 'exacto') return x; else return Math.floor(x);
  }
}
