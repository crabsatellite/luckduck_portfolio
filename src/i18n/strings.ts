export type Lang = "zh" | "en";

export const langFromPath = (path: string): Lang => {
  if (path.startsWith("/en/") || path === "/en") return "en";
  return "zh";
};

export const pathForLang = (path: string, target: Lang, base: string): string => {
  const trimBase = base.replace(/\/+$/, "");
  let p = path;
  if (trimBase && p.startsWith(trimBase)) p = p.slice(trimBase.length);
  if (!p.startsWith("/")) p = "/" + p;
  const isEn = p.startsWith("/en/") || p === "/en";
  let stripped = isEn ? p.replace(/^\/en/, "") || "/" : p;
  if (!stripped.startsWith("/")) stripped = "/" + stripped;
  const next = target === "en" ? "/en" + (stripped === "/" ? "" : stripped) : stripped;
  return trimBase + next;
};

export const STRINGS = {
  zh: {
    "nav.home": "主页",
    "nav.cases": "已测 mod",
    "nav.about": "关于",
    "nav.lang": "EN",
    "nav.lang_aria": "切换到 English",
    "nav.skip": "跳到内容",

    "hero.greeting_en": "Hi, I'm Tingfeng — LUCK666DUCK.",
    "hero.greeting_zh": "嗨, 我是楊庭鳳。",
    "hero.role": "我做 Minecraft mod 测试 — 多轮回归、多语言验证、跨 mod 兼容性取证。版本不限, 测过的 mod 在 MC 1.14 → 1.21 之间都有。简体 / 繁中 / 日文 / English 都能写报告。",
    "hero.stats_inline": "已测 13 个 mod · 提交 433 条 bug · 跑过 24 个测试轮次",
    "hero.cta_cases": "看所有已测 mod",
    "hero.cta_contact": "GitHub / CurseForge",
    "hero.active_label": "最近在测",
    "hero.see_all": "↓ 看全部 13 个",

    "cases.title": "已测 mod",
    "cases.subtitle": "13 个 mod · 433 条 bug · 24 个测试轮次",
    "cases.filter_version": "MC 版本",
    "cases.filter_credited": "仅显示公开署名",
    "cases.filter_regression": "仅显示多轮回归",
    "cases.all": "全部",

    "case.eyebrow": "测试日志",
    "case.test_log_heading": "测试日志",
    "case.featured_bug": "重点案例",
    "case.full_ledger": "完整 bug 列表",
    "case.full_ledger_expand_prefix": "▶ 展开全部",
    "case.full_ledger_expand_suffix": "条",
    "case.full_ledger_collapse": "▼ 折叠",
    "case.no_issues": "本轮测试无问题",
    "case.no_issues_detail": "所有测试项通过, 未在记录中发现可复现 bug。",
    "case.versions": "版本",
    "case.mc": "MC",
    "case.author": "作者",
    "case.depth_signals": "深度信号",
    "case.no_depth": "—",
    "case.legend_title": "状态图例",
    "case.legend_open": "首次发现, 尚未跟进",
    "case.legend_unfixed": "回归追踪中, 仍未修复",
    "case.legend_fixed": "已确认修复",
    "case.legend_noted": "已澄清非 bug",
    "case.legend_crash_label": "crash / 闪退类",
    "case.tags": "分类标签",
    "case.links": "链接",
    "case.mcmod_link": "mcmod.cn 资料页",
    "case.no_mcmod": "(暂无 mcmod.cn 收录)",
    "case.bug_text": "问题描述",
    "case.bug_status": "状态",
    "case.bug_id": "ID",
    "case.bug_version": "版本",
    "case.bug_date": "日期",
    "case.team_panel": "团队",
    "case.team_role_tester": "测试",
    "case.team_role_owner": "所有者",
    "case.team_role_dev": "程序",
    "case.team_role_art": "美术",
    "case.team_role_design": "策划",
    "case.team_role_other": "贡献",
    "case.scene_label": "场景预览",
    "case.scene_placeholder": "占位场景, 待替换为实拍截图",
    "case.intake_label": "初轮",
    "case.regression_label": "回归",
    "case.entries": "条",

    "credited.badge": "verified tester",
    "credited.label": "公开署名",
    "regression.label": "多轮回归",
    "noissues.label": "零 bug 通过",

    "about.title": "关于",
    "about.role": "Minecraft mod tester",
    "about.greeting": "嗨, 我是楊庭鳳 (LUCK666DUCK)。",
    "about.zh_para1": "我是独立 Minecraft mod 测试员。专注于多轮回归测试、多语言场景验证以及跨 mod 兼容性取证。不锁版本, 测过的 mod 在官方发布上覆盖 MC 1.14 → 1.21。",
    "about.zh_para2": "测试报告以中文撰写, 覆盖视觉 / 渲染、生物行为、配方、闪退、本地化等问题类别。每条 bug 记录包含可复现描述与版本、轮次溯源。",
    "about.zh_para3": "本站收录的 13 个 mod、433 条 bug 均来自公开提交记录或与 mod 作者私下沟通的整理稿。已公开署名的 Tester 项目两个: Hot Bath (CurseForge 下载量 100 万+) 与 Instant World Mirror, 均隶属 CrabMods 团队。",
    "about.zh_para4": "如果你做 mod 想找人帮忙跑回归, 简体 / 繁中 / 日文 / English 都可以, 欢迎在 CurseForge 或 GitHub 找我。",

    "footer.handle": "LUCK666DUCK",
    "footer.cn_name": "楊 庭 鳳",
    "footer.tagline": "Minecraft mod tester · zh / 繁 / 日 / en",
    "footer.active": "不锁版本 · 测过的 mod 跨 MC 1.14 → 1.21",
    "footer.copy": "© 2026 Tingfeng Yang. 所有 bug 记录归原始提交者所有, mod 名称及商标归各自作者所有。",
    "footer.archived": "v0.2.0 · 2026-05 redesigned · v1 已存档",
    "footer.v1_link": "查看 v1",
  },
  en: {
    "nav.home": "Home",
    "nav.cases": "Tested mods",
    "nav.about": "About",
    "nav.lang": "中",
    "nav.lang_aria": "Switch to 中文",
    "nav.skip": "Skip to content",

    "hero.greeting_en": "Hi, I'm Tingfeng — LUCK666DUCK.",
    "hero.greeting_zh": "嗨, 我是楊庭鳳。",
    "hero.role": "I test Minecraft mods — multi-round regression, multi-locale verification, cross-mod compatibility forensics. Version-agnostic; the mods I've tested span MC 1.14 → 1.21. I write reports in 简体 / 繁中 / 日本語 / English.",
    "hero.stats_inline": "tested 13 mods · filed 433 bugs · 24 rounds in",
    "hero.cta_cases": "see all tested mods",
    "hero.cta_contact": "GitHub / CurseForge",
    "hero.active_label": "active right now",
    "hero.see_all": "↓ see all 13",

    "cases.title": "Tested mods",
    "cases.subtitle": "13 mods · 433 bugs · 24 test rounds",
    "cases.filter_version": "MC version",
    "cases.filter_credited": "credited only",
    "cases.filter_regression": "regression only",
    "cases.all": "all",

    "case.eyebrow": "tester log",
    "case.test_log_heading": "Tester log",
    "case.featured_bug": "Featured bug",
    "case.full_ledger": "Full bug ledger",
    "case.full_ledger_expand_prefix": "▶ expand all",
    "case.full_ledger_expand_suffix": "entries",
    "case.full_ledger_collapse": "▼ collapse",
    "case.no_issues": "passed clean",
    "case.no_issues_detail": "no reproducible issues found in this round.",
    "case.versions": "versions",
    "case.mc": "mc",
    "case.author": "author",
    "case.depth_signals": "depth signals",
    "case.no_depth": "—",
    "case.legend_title": "status legend",
    "case.legend_open": "first observed, no follow-up",
    "case.legend_unfixed": "tracked through regression, still unfixed",
    "case.legend_fixed": "verified fixed",
    "case.legend_noted": "clarified as not-a-bug by author",
    "case.legend_crash_label": "crash class (red)",
    "case.tags": "tags",
    "case.links": "links",
    "case.mcmod_link": "mcmod.cn entry",
    "case.no_mcmod": "(no mcmod.cn entry)",
    "case.bug_text": "description",
    "case.bug_status": "status",
    "case.bug_id": "id",
    "case.bug_version": "version",
    "case.bug_date": "date",
    "case.team_panel": "Team",
    "case.team_role_tester": "Tester",
    "case.team_role_owner": "Owner",
    "case.team_role_dev": "Dev",
    "case.team_role_art": "Artist",
    "case.team_role_design": "Design",
    "case.team_role_other": "Member",
    "case.scene_label": "scene preview",
    "case.scene_placeholder": "placeholder scene; real screenshots to come",
    "case.intake_label": "intake",
    "case.regression_label": "regression",
    "case.entries": "entries",

    "credited.badge": "verified tester",
    "credited.label": "publicly credited",
    "regression.label": "regression rounds",
    "noissues.label": "zero-bug pass",

    "about.title": "About",
    "about.role": "Minecraft mod tester",
    "about.greeting": "Hi, I'm Tingfeng (LUCK666DUCK).",
    "about.zh_para1": "Independent Minecraft mod tester. Focus on multi-round regression, multi-locale verification, and cross-mod compatibility forensics. Version-agnostic; the mods I've tested span MC 1.14 → 1.21 across canonical releases.",
    "about.zh_para2": "Test reports are written in Chinese and cover visual / rendering, entity behavior, recipes, crashes, localization, and mod-compat. Each bug carries a reproducible description tied to version and round of intake.",
    "about.zh_para3": "The 13 mods and 433 bug entries surfaced here come from public submissions and from mod-author-direct correspondence. Two mods carry a publicly verifiable Tester credit: Hot Bath (1M+ CurseForge downloads) and Instant World Mirror, both under the CrabMods team.",
    "about.zh_para4": "If you build mods and want a regression run, I read 简体 / 繁中 / 日本語 / English. Find me on CurseForge or GitHub.",

    "footer.handle": "LUCK666DUCK",
    "footer.cn_name": "楊 庭 鳳",
    "footer.tagline": "Minecraft mod tester · zh / 繁 / 日 / en",
    "footer.active": "version-agnostic · MC 1.14 → 1.21 across mods tested",
    "footer.copy": "© 2026 Tingfeng Yang. Bug reports remain authored by their filer. Mod names and trademarks belong to their respective authors.",
    "footer.archived": "v0.2.0 · redesigned 2026-05 · v1 archived",
    "footer.v1_link": "view v1",
  },
} as const;

export type StringKey = keyof typeof STRINGS["zh"];

export const t = (lang: Lang, key: StringKey): string => {
  return STRINGS[lang][key] ?? key;
};
