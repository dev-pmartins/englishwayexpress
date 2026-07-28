import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { publicApi } from '../../api/publicApi';

export default function ModulesPage() {
  const { t } = useTranslation();
  const [langs, setLangs]       = useState(null);
  const [selected, setSelected] = useState('');
  const [modules, setModules]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Load available languages
  useEffect(() => {
    publicApi.getLanguages()
      .then(body => setLangs(body.data ?? body))
      .catch(() => {});
  }, []);

  // Load modules whenever selected language changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    publicApi.getModules(selected)
      .then(body => { if (!cancelled) { setModules(body.data?.data ?? body.data ?? []); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(t('loadError', 'Erro ao carregar.')); setLoading(false); } });
    return () => { cancelled = true; };
  }, [selected, t]);

  return (
    <article className="catalog-page">
      <h1 className="catalog-page-title">{t('modulesPageTitle', 'Módulos de estudo')}</h1>
      <p className="catalog-page-subtitle">
        {t('modulesPageSubtitle', 'Explore os módulos disponíveis por idioma.')}
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

      {!loading && !error && (modules ?? []).length === 0 && (
        <p className="posts-state-msg">{t('modulesNone', 'Nenhum módulo encontrado.')}</p>
      )}

      {!loading && !error && (modules ?? []).length > 0 && (
        <div className="catalog-grid">
          {modules.map(mod => (
            <div key={mod.id} className="catalog-card catalog-card--module">
              <div className="catalog-card-top">
                <span className="catalog-card-lang">{mod.language?.name}</span>
                {mod.minimum_level && (
                  <span className="catalog-card-level-badge">{mod.minimum_level}+</span>
                )}
              </div>
              <h2 className="catalog-card-name">{mod.name}</h2>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
