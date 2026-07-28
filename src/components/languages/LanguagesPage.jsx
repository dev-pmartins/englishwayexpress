import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { publicApi } from '../../api/publicApi';

const FLAG_MAP = { en: '🇬🇧', es: '🇪🇸', de: '🇩🇪', fr: '🇫🇷', it: '🇮🇹', 'pt-BR': '🇧🇷' };

export default function LanguagesPage() {
  const { t } = useTranslation();
  const [langs, setLangs]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    publicApi.getLanguages()
      .then(body => { if (!cancelled) { setLangs(body.data ?? body); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(t('loadError', 'Erro ao carregar.')); setLoading(false); } });
    return () => { cancelled = true; };
  }, [t]);

  return (
    <article className="catalog-page">
      <h1 className="catalog-page-title">{t('languagesPageTitle', 'Idiomas disponíveis')}</h1>
      <p className="catalog-page-subtitle">
        {t('languagesPageSubtitle', 'Conheça os idiomas oferecidos em nossa plataforma.')}
      </p>

      {loading && <p className="posts-state-msg">{t('loading', 'Carregando...')}</p>}
      {error   && <p className="posts-state-msg posts-state-error">{error}</p>}

      {!loading && !error && (
        <div className="catalog-grid catalog-grid--langs">
          {(langs ?? []).map(lang => (
            <div key={lang.id} className="catalog-card catalog-card--lang">
              <span className="catalog-card-flag">{FLAG_MAP[lang.code] ?? '🌐'}</span>
              <h2 className="catalog-card-name">{lang.name}</h2>
              <code className="catalog-card-code">{lang.code}</code>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
