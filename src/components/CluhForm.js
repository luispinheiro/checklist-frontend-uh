import React, { useContext, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import Alert from './Alert'
import { AuthContext } from '../hooks/useAuth'
import { useCluhs } from '../hooks/useCluhs'

const CluhForm = (props) => {
  const auth = useContext(AuthContext);
  const cluhs = useCluhs();
  const [ cluh, setCluh ] = useState({ id: 0, dataCriacao: "", nivel: "", abastecimento:"",
    condicao:"", observacao:"", tag:"" });
  const [ redirect, setRedirect ] = useState(false);

  useEffect(() => {
    const editId = props.match.params.id;

    if (editId && auth.credentials.username !== null) {
      cluhs.load(~~editId);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [ auth.credentials ]);

useEffect(() => {
    if (cluhs.cluhLoaded) {
        setCluh(cluhs.cluhLoaded);
        cluhs.clearCluhLoaded();
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [ cluhs.cluhLoaded ]);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    cluhs.save(cluh);
  }

  const onInputChangeHandler = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    setCluh({ ...cluh, [field]: value});
  }

  if (!auth.isAuthenticated()) {
      return <Redirect to="/login" />
  }

  if (redirect || cluhs.cluhUpdated) {
    return <Redirect to="/" />
  }

  return (
    <div>
      <h1>Checklists de UH</h1>
      {cluhs.error && <Alert message={cluhs.error} />}
      <form onSubmit={onSubmitHandler}>
        <div className="row">
          <div className="form-group col-md-4">
              <label htmlFor="nivel">Nível</label>
              <div className="input-group">
                <input type="text"
                    className="form-control"
                    name="nivel"
                    value={cluh.nivel}
                    placeholder="Digite em porcentagem"
                    onChange={onInputChangeHandler} />
                <div class="input-group-append">
                  <span class="input-group-text">%</span>
                </div>
              </div>
          </div>

          <div className="form-group col-md-4">
            <label htmlFor="abastecimento">Abastecimento</label>
            <div className="input-group">
              <input type="text"
                  className="form-control"
                  name="abastecimento"
                  value={cluh.abastecimento}
                  placeholder="Digite em litros"
                  onChange={onInputChangeHandler} />
              <div class="input-group-append">
                  <span class="input-group-text">L</span>
                </div>
              </div>
          </div>

          <div className="form-group col-md-4">
              <label htmlFor="condicao">Condição</label>
              <input type="text"
                  className="form-control"
                  name="condicao"
                  value={cluh.condicao}
                  placeholder="limpo/sujo"
                  onChange={onInputChangeHandler} />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-4">
              <label htmlFor="tag">TAG</label>
              <input type="text"
                  className="form-control"
                  name="tag"
                  value={cluh.tag}
                  placeholder="TAG UH-01 a UH-20"
                  onChange={onInputChangeHandler} />
          </div>

          <div className="form-group col-md-8">
              <label htmlFor="observacao">Observação</label>
              <input type="text"
                  className="form-control"
                  name="observacao"
                  value={cluh.observacao}
                  placeholder="Digite se precisar"
                  onChange={onInputChangeHandler} />
          </div>
        </div>

        <button
            type="submit"
            className="btn btn-primary"
            disabled={cluhs.processing}>
                {
                    cluhs.processing ?
                        <span className="spinner-border spinner-border-sm"
                            role="status" aria-hidden="true">
                        </span>
                    : cluh.id === 0 ? "Cadastrar" : "Alterar"
                }
        </button>
        &nbsp;&nbsp;
        <button
            type="button"
            className="btn btn-primary"
            disabled={cluhs.processing}
            onClick={() => setRedirect(true)}>
                Cancelar
        </button>
      </form>
    </div>
  );
}

export default CluhForm;
