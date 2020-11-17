import React, { useState, useEffect } from 'react';
import Question from '../Question';
import '../ArrayExtensionMethods';

const useQuestao = (file) => {

    const [question, setQuestion] = useState(null);
    const [gaps, setGaps] = useState([]);
    const [longestAlternative, setLongestAlternative] = useState(0);

    const [currentField, setCurrentField] = useState(0);
    const [results, setResults] = useState('');
    const [hints, setHints] = useState([]);
    const [done, setDone] = useState(false);

    useEffect(() => {
        setQuestion(null);
        setCurrentField(0);
        setResults('');
        setHints([]);
        setDone(false);

        fetch(file)
            .then(res => res.text())
            .then(Question.from)
            .then(q => { setGaps(new Array(q.gaps).fill('')); return q; })
            .then(q => { setLongestAlternative(q.longestAlternative); return q; })
            .then(setQuestion)
            .catch(console.error);
    }, [file]);

    return [question, gaps, setGaps, longestAlternative, currentField, setCurrentField, results, setResults, hints, setHints, done, setDone];
}

const Questao = ({ file, nextFile }) => {

    const [question, gaps, setGaps, longestAlternative, currentField, setCurrentField, results, setResults, hints, setHints, done, setDone] = useQuestao(file);
    const alternativeSize = { width: longestAlternative * 12 };

    const mindTheGaps2 = question => {

        const genInput = index => {

            return <input
                readOnly
                className={`gap ${gaps[index].length > 0 ? 'full' : 'empty'}`}
                key={`gap_${index}`}
                value={gaps[index]}
                style={alternativeSize}
                onClick={onGapClicked(index)} />;
        }

        const resultState = question.lines.reduce((state, line, i) => {
            const parts = line.split("{{GAP}}");

            const innerState = parts.reduce((lineState, part, j) => {
                if (j === 0) return {
                    innerCurrentGapIndex: lineState.innerCurrentGapIndex,
                    line: [...lineState.line, part]
                };
                else return {
                    innerCurrentGapIndex: lineState.innerCurrentGapIndex + 1,
                    line: [lineState.line, genInput(lineState.innerCurrentGapIndex), part]
                }
            }, { innerCurrentGapIndex: state.currentGapIndex, line: [] });

            return {
                currentGapIndex: innerState.innerCurrentGapIndex,
                lines: [...state.lines, <span key={i} className='line'>{innerState.line}</span>]
            };

        }, { currentGapIndex: 0, lines: [] });

        return resultState.lines;
    }

    const onAlternativeClick = (value) => () => {
        const newValue = [...gaps];
        newValue[currentField] = value;
        setGaps(newValue);
        setCurrentField(currentField < gaps.length ? currentField + 1 : currentField);
    }

    const verifyAnswer = () => {
        const sum = arr => arr.reduce((acc, x) => acc + x);
        const max = arr => arr.reduce((max, x) => x > max ? x : max);

        const allAnswered = !gaps.any(g => !g || g.length === 0);

        if (allAnswered) {
            setDone(true);

            const correction = question.acceptedAnswers.map(answer => {
                return answer.map((a, i) => a === gaps[i] ? 1 : 0);
            });

            const grade = max(correction.map(sum));
            const percent = (grade / gaps.length) * 100;

            const message = percent + "% correto"

            setResults(message);

            const hintsToShow = question.hints.reduce((display, h) => {
                const { field, expected, text } = h;
                const answer = gaps[field];
                if (answer === expected) {
                    if (display.findIndex(x => x === text)) {
                        return [...display, text];
                    }
                }
                return display;
            }, []);

            setHints(hintsToShow);
        }
    }

    const onGapClicked = index => () => {

        if (index === currentField - 1) {
            const newGaps = [...gaps];
            newGaps[index] = '';
            setCurrentField(currentField - 1);
            setGaps(newGaps);
        }

    }

    return (
        <>
            {question &&
                (
                    <div className="question">
                        <div className="content">
                            <pre>
                                <code className="js">
                                    {mindTheGaps2(question)}
                                </code>
                            </pre>
                        </div>
                        <div className="alternatives">
                            {
                                question.alternatives.map((alternative, i) =>
                                    <button
                                        type='button'
                                        key={i}
                                        className='alternative'
                                        style={alternativeSize}
                                        onClick={onAlternativeClick(alternative.value)}
                                        data-title={alternative.description || null}>
                                        {alternative.value}
                                    </button>)
                            }
                        </div>
                        {done &&
                            <div className='results'>
                                <div className="result">
                                    {results}
                                </div>
                                {
                                    hints.length > 0 &&
                                    <div className="hints">
                                        {hints.map((x, i) => <p className='hint' key={i}>{`dica: ${x}`}</p>)}
                                    </div>
                                }
                            </div>
                        }
                        <div className='actions'>
                            <button
                                type='button'
                                onClick={!done ? verifyAnswer : nextFile}>
                                {!done ? 'Responder' : 'Continuar'}
                            </button>
                        </div>

                    </div>
                )}
        </>
    );
}

export default Questao;