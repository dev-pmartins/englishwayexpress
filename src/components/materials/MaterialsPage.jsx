import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { publicApi } from '../../api/publicApi';

export default function MaterialsPage() {
  const { t } = useTranslation();
  const [langs, setLangs]       = useState(null);
  const [selected, setSelected] = useState('');
  const [groups, setGroups]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [open, setOpen]         = useState(null);

  // Load available languages
  useEffect(() => {
    publicApi.getLanguages()
      .then(body => setLangs(body.data ?? body))
      .catch(() => {});
  }, []);

  // Load materials (open-source) grouped by language
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    const params = selected ? { langs: selected } : {};
    publicApi.getMaterials(params)
      .then(body => { if (!cancelled) { setGroups(body.data ?? []); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(t('loadError', 'Erro ao carregar.')); setLoading(false); } });
    return () => { cancelled = true; };
  }, [selected, t]);

  const toggleMaterial = (id) => setOpen(prev => (prev === id ? null : id));

  return (
    <article className="catalog-page">
      <h1 className="catalog-page-title">{t('materialsPageTitle', 'Materiais disponíveis')}</h1>
      <p className="catalog-page-subtitle">
        {t('materialsPageSubtitle', 'Acesse gratuitamente nossos materiais de estudo.')}
      </p>

      <div className="catalog-filters">
        <label className="catalog-filter-label">{t('filterByLanguage', 'Filtrar por idioma')}</label>
        <div className="posts-filter-pills">
          <button
            className={`posts-filter-pill${selected === '' ? ' posts-filter-pill--active' : ''}`}
            onClick={() => setSelected('')}
          >
            {t('postsFilterAll', 'Todos')}
          </button>
          {(langs ?? []).map(l => (
            <button
              key={l.code}
              className={`posts-filter-pill${selected === l.code ? ' posts-filter-pill--active' : ''}`}
              onClick={() => setSelected(l.code)}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="posts-state-msg">{t('loading', 'Carregando...')}</p>}
      {error   && <p className="posts-state-msg posts-state-error">{error}</p>}

      {!loading && !error && (groups ?? []).length === 0 && (
        <p className="posts-state-msg">{t('materialsNone', 'Nenhum material disponível.')}</p>
      )}

      {!loading && !error && (groups ?? []).map(group => (
        <section key={group.language.id} className="catalog-lang-group">
          <h2 className="catalog-lang-group-title">{group.language.name}</h2>

          {group.materials.length === 0 ? (
            <p className="posts-state-msg">{t('materialsNone', 'Nenhum material disponível.')}</p>
          ) : (
            <ul className="student-materials-list">
              {group.materials.map(mat => (
                <li key={mat.id}>
                  <button
                    className="student-material-btn"
                    onClick={() => toggleMaterial(mat.id)}
                  >
                    <span>{mat.title || mat.name}</span>
                    <span className="student-material-arrow">
                      {open === mat.id ? '▲' : '▼'}
                    </span>
                  </button>

                  {open === mat.id && (
                    <div className="student-material-body">
                      {mat.module && (
                        <p className="catalog-material-module">
                          {t('materialModule', 'Módulo')}: <strong>{mat.module.name}</strong>
                        </p>
                      )}
                      {mat.content && (
                        <div className="student-material-content">
                          {mat.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        </div>
                      )}
                      {mat.attachments?.length > 0 && (
                        <ul className="student-attachments">
                          {mat.attachments.map(att => (
                            <li key={att.id}>
                              <a href={att.url} target="_blank" rel="noreferrer">
                                📎 {att.original_name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                      {mat.slug && (
                        <Link to={`/area-do-aluno/material/${mat.slug}`} className="comp-material-detail-link">
                          {t('materialViewFull', 'Ver material completo')} →
                        </Link>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}
