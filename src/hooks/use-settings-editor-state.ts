/**
 * Local draft state for the admin settings editor.
 *
 * Mirrors the pattern from useThemeEditorState:
 *   - Draft copy of editable config fields from server config
 *   - Dirty checking via JSON.stringify snapshot
 *   - No live preview needed (unlike theme editor)
 */
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type {
  CurrencyConfig,
  NavConfig,
  SiteConfig,
} from "@/lib/config/site-config-schema";

export interface SettingsEditorDraft {
  readonly bankName: string;
  readonly bankSlug: string;
  readonly gameBusinessName: string;
  readonly verificationChannelName: string;
  readonly tosText: string;
  readonly currency: CurrencyConfig;
  readonly nav: NavConfig;
}

export interface SettingsEditorState {
  readonly draft: SettingsEditorDraft;
  readonly hasUnsavedChanges: boolean;

  readonly updateBankName: (name: string) => void;
  readonly updateBankSlug: (slug: string) => void;
  readonly updateGameBusinessName: (name: string) => void;
  readonly updateVerificationChannelName: (name: string) => void;
  readonly updateTosText: (text: string) => void;
  readonly updateCurrency: (patch: Partial<CurrencyConfig>) => void;
  readonly updateNav: (patch: Partial<NavConfig>) => void;
  readonly addNavLink: (link: { label: string; href: string }) => void;
  readonly removeNavLink: (index: number) => void;
  readonly updateNavLink: (index: number, link: { label: string; href: string }) => void;
  readonly discardChanges: () => void;
  readonly getDraftConfig: () => SiteConfig;
}

function extractDraft(config: SiteConfig): SettingsEditorDraft {
  return {
    bankName: config.bankName,
    bankSlug: config.bankSlug,
    gameBusinessName: config.gameBusinessName,
    verificationChannelName: config.verificationChannelName,
    tosText: config.tosText,
    currency: { ...config.currency },
    nav: {
      ...config.nav,
      links: config.nav.links.map((l) => ({ ...l })),
    },
  };
}

export function useSettingsEditorState(
  serverConfig: SiteConfig
): SettingsEditorState {
  const [draft, setDraft] = useState<SettingsEditorDraft>(
    () => extractDraft(serverConfig)
  );

  const serverSnapshot = useRef(
    JSON.stringify(extractDraft(serverConfig))
  );

  // Reset draft when server config changes (e.g. after a save).
  useEffect(() => {
    const newSnapshot = JSON.stringify(extractDraft(serverConfig));
    if (newSnapshot !== serverSnapshot.current) {
      serverSnapshot.current = newSnapshot;
      setDraft(extractDraft(serverConfig));
    }
  }, [serverConfig]);

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(draft) !== serverSnapshot.current,
    [draft]
  );

  const updateBankName = useCallback((name: string): void => {
    setDraft((prev) => ({ ...prev, bankName: name }));
  }, []);

  const updateBankSlug = useCallback((slug: string): void => {
    setDraft((prev) => ({ ...prev, bankSlug: slug }));
  }, []);

  const updateGameBusinessName = useCallback((name: string): void => {
    setDraft((prev) => ({ ...prev, gameBusinessName: name }));
  }, []);

  const updateVerificationChannelName = useCallback((name: string): void => {
    setDraft((prev) => ({ ...prev, verificationChannelName: name }));
  }, []);

  const updateTosText = useCallback((text: string): void => {
    setDraft((prev) => ({ ...prev, tosText: text }));
  }, []);

  const updateCurrency = useCallback((patch: Partial<CurrencyConfig>): void => {
    setDraft((prev) => ({
      ...prev,
      currency: { ...prev.currency, ...patch },
    }));
  }, []);

  const updateNav = useCallback((patch: Partial<NavConfig>): void => {
    setDraft((prev) => ({
      ...prev,
      nav: { ...prev.nav, ...patch },
    }));
  }, []);

  const addNavLink = useCallback(
    (link: { label: string; href: string }): void => {
      setDraft((prev) => ({
        ...prev,
        nav: { ...prev.nav, links: [...prev.nav.links, link] },
      }));
    },
    []
  );

  const removeNavLink = useCallback((index: number): void => {
    setDraft((prev) => ({
      ...prev,
      nav: {
        ...prev.nav,
        links: prev.nav.links.filter((_, i) => i !== index),
      },
    }));
  }, []);

  const updateNavLink = useCallback(
    (index: number, link: { label: string; href: string }): void => {
      setDraft((prev) => ({
        ...prev,
        nav: {
          ...prev.nav,
          links: prev.nav.links.map((l, i) => (i === index ? link : l)),
        },
      }));
    },
    []
  );

  const discardChanges = useCallback((): void => {
    setDraft(extractDraft(serverConfig));
  }, [serverConfig]);

  const getDraftConfig = useCallback((): SiteConfig => {
    return {
      ...serverConfig,
      bankName: draft.bankName,
      bankSlug: draft.bankSlug,
      gameBusinessName: draft.gameBusinessName,
      verificationChannelName: draft.verificationChannelName,
      tosText: draft.tosText,
      currency: draft.currency,
      nav: draft.nav,
    };
  }, [serverConfig, draft]);

  return {
    draft,
    hasUnsavedChanges,
    updateBankName,
    updateBankSlug,
    updateGameBusinessName,
    updateVerificationChannelName,
    updateTosText,
    updateCurrency,
    updateNav,
    addNavLink,
    removeNavLink,
    updateNavLink,
    discardChanges,
    getDraftConfig,
  };
}
