import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { publicApi } from '../../api/publicApi';

const LEVEL_COLORS = {
  A1: '#d1fae5', A2: '#a7f3d0',
  B1: '#bfdbfe', B2: '#93c5fd',
  C1: '#e9d5ff', C2: '#c4b5fd',
};

export default function LevelsPage() {
  const { t } = useTranslation();
  const [levels, setLevels]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    publicApi.getLevels()
      .then(body => { if (!cancelled) { setLevels(Array.isArray(body) ? body : body.data ?? []); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(t('loadError', 'Erro ao carregar.')); setLoading(false); } });
    return () => { cancelled = true; };
  }, [t]);

  return (
    <article className="catalog-page">
      <h1 className="catalog-page-title">{t('levelsPageTitle', 'Níveis de aprendizado')}</h1>
      <p className="catalog-page-subtitle">
        {t('levelsPageSubtitle', 'Utilizamos o padrão CEFR (Quadro Europeu Comum de Referência) para classificar o aprendizado.')}
      </p>

      {loading && <p className="posts-state-msg">{t('loading', 'Carregando...')}</p>}
      {error   && <p className="posts-state-msg posts-state-error">{error}</p>}

      {!loading && !error && (
        <div className="catalog-grid catalog-grid--levels">
          {(levels ?? []).map(level => (
            <div
              key={level.id}
              className="catalog-card catalog-card--level"
              style={{ '--level-color': LEVEL_COLORS[level.code] ?? '#f3f4f6' }}
            >
              <span className="catalog-card-level-code">{level.code}</span>
              <p className="catalog-card-level-name">{level.name}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
