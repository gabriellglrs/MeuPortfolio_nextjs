"use client";

import "github-markdown-css/github-markdown.css";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowRight,
    Award,
    Briefcase,
    Calendar,
    CheckCircle,
    Code,
    Database,
    ExternalLink,
    GitFork,
    Github,
    Globe,
    GraduationCap,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Server,
    ShieldCheck,
    Star,
    Target,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface GitHubRepo {
    owner: any;
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    topics: string[];
    pushed_at: string;
}

export default function Portfolio() {
    const [mounted, setMounted] = useState(false);
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Adicione aqui:
    const [readme, setReadme] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalRepo, setModalRepo] = useState<GitHubRepo | null>(null);

    useEffect(() => {
        setMounted(true);
        fetchGitHubRepos();
    }, []);

    const fetchGitHubRepos = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "https://api.github.com/users/gabriellglrs/repos?sort=updated&per_page=100"
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar repositórios");
            }

            const data: GitHubRepo[] = await response.json();

            // Filtrar e ordenar repositórios
            const filteredRepos = data
                .filter(
                    (repo) =>
                        !repo.name.includes("gabriellglrs") && // Remove repo do perfil
                        repo.description && // Só repos com descrição
                        repo.name !== "gabriellglrs" // Remove readme repo
                )
                .sort((a, b) => {
                    // Priorizar repos com mais stars e mais recentes
                    const scoreA =
                        a.stargazers_count * 2 +
                        new Date(a.pushed_at).getTime() / 1000000000;
                    const scoreB =
                        b.stargazers_count * 2 +
                        new Date(b.pushed_at).getTime() / 1000000000;
                    return scoreB - scoreA;
                })
                .slice(0, 12); // Pegar os 9 melhores

            setRepos(filteredRepos);
        } catch (err) {
            setError("Erro ao carregar projetos do GitHub");
            console.error("Erro:", err);
        } finally {
            setLoading(false);
        }
    };

    const getLanguageColor = (language: string | null) => {
        const colors: { [key: string]: string } = {
            JavaScript: "#f1e05a",
            TypeScript: "#2b7489",
            Java: "#b07219",
            PHP: "#4F5D95",
            Python: "#3572A5",
            HTML: "#e34c26",
            CSS: "#563d7c",
            Vue: "#2c3e50",
            React: "#61dafb",
            "C#": "#239120",
            Go: "#00ADD8",
            Rust: "#dea584",
        };
        return colors[language || ""] || "#6b7280";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "short",
        });
    };

    const skills = {
        backend: [
            "Java",
            "Spring Boot",
            "NestJS",
            "TypeScript",
            "PHP",
            "Laravel",
            "Node.js",
        ],
        frontend: [
            "React",
            "Next.js",
            "TypeScript",
            "JavaScript",
            "HTML5",
            "CSS3",
            "Tailwind CSS",
        ],
        database: ["MySQL", "PostgreSQL", "MongoDB"],
        tools: ["Git", "Docker", "AWS", "Vercel", "Postman", "VS Code"],
    };

    const handleCardClick = async (repo: GitHubRepo) => {
        setModalRepo(repo);
        setModalOpen(true);
        setReadme(null);
        try {
            const res = await fetch(
                `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/main/README.md`
            );
            if (res.ok) {
                const text = await res.text();
                setReadme(text);
            } else {
                setReadme("README.md não encontrado.");
            }
        } catch {
            setReadme("Erro ao carregar README.md.");
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            {/* Header/Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:border-slate-800/50 dark:bg-slate-950/80">
                <div className="container flex h-14 md:h-16 items-center justify-between px-4">
                    <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
                            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 md:p-2 rounded-lg">
                                <Code className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            </div>
                        </div>
                        <span className="font-display text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                                Dev
                            </span>
                            {" Gabriel  Lucas"}
                        </span>
                    </div>
                    <nav className="hidden sm:flex items-center space-x-4 md:space-x-8">
                        <Link
                            href="#sobre"
                            className="font-body text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            Sobre
                        </Link>
                        <Link
                            href="#experiencia"
                            className="font-body text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            Experiência
                        </Link>
                        <Link
                            href="#projetos"
                            className="font-body text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            Projetos
                        </Link>
                        <Link
                            href="#contato"
                            className="font-body text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            Contato
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-12 md:py-24 px-4 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800"></div>
                <div className="absolute top-0 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
                        <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                            <div className="space-y-4 md:space-y-6">
                                <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/50">
                                    <Zap className="h-3 w-3 md:h-4 md:w-4 text-blue-600 mr-1.5 md:mr-2" />
                                    <span className="font-body text-xs md:text-sm font-medium text-blue-700 dark:text-blue-300">
                                        Desenvolvedor Full Stack
                                    </span>
                                </div>

                                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
                                    <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-slate-400">
                                        Gabriel
                                    </span>{" "}
                                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                                        Lucas
                                    </span>
                                </h1>

                                <p className="font-body text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed mx-auto lg:mx-0">
                                    Especialista em{" "}
                                    <strong className="font-semibold text-slate-900 dark:text-white">
                                        Java, Spring Boot, NestJS, React e
                                        Next.js
                                    </strong>
                                    . Atualmente estagiário no INSS e estudante
                                    de Engenharia de Software em Brasília, DF.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                                <Button
                                    size="lg"
                                    className="font-body bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto"
                                    asChild
                                >
                                    <Link href="#projetos">
                                        Ver Projetos
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="font-body border-2 border-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 bg-transparent w-full sm:w-auto"
                                    asChild
                                >
                                    <Link href="#contato">
                                        Entrar em Contato
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="font-body border-2 border-purple-400 hover:border-purple-600 hover:text-purple-700 transition-all duration-300 bg-transparent w-full sm:w-auto"
                                    asChild
                                >
                                    <Link
                                        href="/cv-gabriel-lucas.pdf"
                                        target="_blank"
                                        download
                                    >
                                        Baixar CV
                                    </Link>
                                </Button>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-4 md:gap-6">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 md:h-12 md:w-12 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110"
                                    asChild
                                >
                                    <Link
                                        href="https://github.com/gabriellglrs"
                                        target="_blank"
                                    >
                                        <Github className="h-4 w-4 md:h-5 md:w-5" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 md:h-12 md:w-12 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110"
                                    asChild
                                >
                                    <Link
                                        href="https://www.linkedin.com/in/gabriellglrs/"
                                        target="_blank"
                                    >
                                        <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 md:h-12 md:w-12 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110"
                                    asChild
                                >
                                    <Link href="mailto:gabriellglrs@gmail.com">
                                        <Mail className="h-4 w-4 md:h-5 md:w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="relative flex justify-center lg:justify-end order-first lg:order-last">
                            <div className="relative">
                                {/* Decorative elements */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                                <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-bounce"></div>
                                <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-10 animate-pulse"></div>

                                <div className="relative w-64 h-64 md:w-80 md:h-80">
                                    <Image
                                        src="/profile.png"
                                        alt="Gabriel Lucas - Desenvolvedor Full Stack"
                                        fill
                                        className="rounded-full object-cover border-4 border-white shadow-2xl dark:border-slate-800"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 md:py-16 px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl md:rounded-2xl mb-3 md:mb-4">
                                <Code className="h-5 w-5 md:h-8 md:w-8 text-white" />
                            </div>
                            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                42+
                            </div>
                            <div className="font-body text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Repositórios
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl md:rounded-2xl mb-3 md:mb-4">
                                <TrendingUp className="h-5 w-5 md:h-8 md:w-8 text-white" />
                            </div>
                            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                3+
                            </div>
                            <div className="font-body text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Anos Experiência
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl md:rounded-2xl mb-3 md:mb-4">
                                <Target className="h-5 w-5 md:h-8 md:w-8 text-white" />
                            </div>
                            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                10+
                            </div>
                            <div className="font-body text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Tecnologias
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl md:rounded-2xl mb-3 md:mb-4">
                                <Award className="h-5 w-5 md:h-8 md:w-8 text-white" />
                            </div>
                            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                100%
                            </div>
                            <div className="font-body text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Dedicação
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl md:rounded-2xl mb-3 md:mb-4">
                                <CheckCircle className="h-5 w-5 md:h-8 md:w-8 text-white" />
                            </div>
                            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                15+
                            </div>
                            <div className="font-body text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Projetos Concluídos
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl md:rounded-2xl mb-3 md:mb-4">
                                <ShieldCheck className="h-5 w-5 md:h-8 md:w-8 text-white" />
                            </div>
                            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                8
                            </div>
                            <div className="font-body text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Certificações
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-xl md:rounded-2xl mb-3 md:mb-4">
                                <Users className="h-5 w-5 md:h-8 md:w-8 text-white" />
                            </div>
                            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                20+
                            </div>
                            <div className="font-body text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Colaborações em Equipe
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl md:rounded-2xl mb-3 md:mb-4">
                                <Zap className="h-5 w-5 md:h-8 md:w-8 text-white" />
                            </div>
                            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                500+
                            </div>
                            <div className="font-body text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Commits Realizados
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="sobre" className="py-12 md:py-24 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/50 mb-6">
                            <Users className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="font-body text-sm font-medium text-blue-700 dark:text-blue-300">
                                Conheça mais sobre mim
                            </span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                            Sobre Mim
                        </h2>
                        <p className="font-body text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                            Desenvolvedor apaixonado por tecnologia, sempre em
                            busca de novos desafios e aprendizados
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                                        <GraduationCap className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="font-display text-xl">
                                        Formação Acadêmica
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="font-body text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Estudante de{" "}
                                    <strong className="font-semibold text-slate-900 dark:text-white">
                                        Engenharia de Software
                                    </strong>
                                    , com foco em desenvolvimento de sistemas
                                    robustos e escaláveis. Sempre buscando
                                    aplicar as melhores práticas de
                                    desenvolvimento e arquitetura de software.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                                        <Briefcase className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="font-display text-xl">
                                        Experiência Profissional
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="font-body text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Estagiário no{" "}
                                    <strong className="font-semibold text-slate-900 dark:text-white">
                                        INSS (Instituto Nacional do Seguro
                                        Social)
                                    </strong>
                                    , trabalhando com PHP, Laravel e MySQL no
                                    desenvolvimento de sistemas internos para
                                    gestão de processos previdenciários.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-12">
                        <div className="text-center">
                            <h3 className="font-display text-3xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                                Tecnologias & Habilidades
                            </h3>
                            <p className="font-body text-slate-600 dark:text-slate-300">
                                Ferramentas e tecnologias que domino
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                                            <Server className="h-5 w-5 text-white" />
                                        </div>
                                        <CardTitle className="font-display text-lg">
                                            Backend
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.backend.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="font-body bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                                            <Globe className="h-5 w-5 text-white" />
                                        </div>
                                        <CardTitle className="font-display text-lg">
                                            Frontend
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.frontend.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="font-body bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                                            <Database className="h-5 w-5 text-white" />
                                        </div>
                                        <CardTitle className="font-display text-lg">
                                            Database
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.database.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="font-body bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                                            <Code className="h-5 w-5 text-white" />
                                        </div>
                                        <CardTitle className="font-display text-lg">
                                            Ferramentas
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.tools.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="font-body bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section
                id="experiencia"
                className="py-12 md:py-24 px-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
            >
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/50 mb-6">
                            <Briefcase className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="font-body text-sm font-medium text-blue-700 dark:text-blue-300">
                                Minha trajetória
                            </span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                            Experiência
                        </h2>
                        <p className="font-body text-xl text-slate-600 dark:text-slate-300">
                            Minha jornada profissional e acadêmica
                        </p>
                    </div>

                    <div className="space-y-8">
                        <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-4">
                                        {/* Logo do INSS */}
                                        <div className=" rounded-xl flex items-center justify-center">
                                            <Image
                                                src="/inss-logo.png"
                                                alt="INSS"
                                                width={60}
                                                height={60}
                                                className="object-contain"
                                            />
                                        </div>
                                        <div>
                                            <CardTitle className="font-display text-xl mb-2">
                                                Estagiário em Desenvolvimento de Software
                                            </CardTitle>
                                            <CardDescription className="font-body flex flex-col gap-1 text-base">
                                                <span className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4" />
                                                    INSS · Estágio
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    jun de 2025 - o momento · 3
                                                    meses
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    Brasília, Distrito Federal,
                                                    Brasil · Presencial
                                                </span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge className="font-body bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800">
                                        Atual
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="font-body text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                                    Atuo como estagiário no{" "}
                                    <strong>GCWEB</strong>, sistema interno de
                                    logística do INSS utilizado por servidores
                                    de todo o Brasil. Esse sistema é essencial
                                    para o gerenciamento de processos logísticos
                                    e administrativos da instituição.
                                </p>
                                <ul className="font-body text-slate-600 dark:text-slate-300 mb-4 list-disc list-inside space-y-1">
                                    <li>
                                        Suporte técnico aos usuários do sistema,
                                        identificando e solucionando problemas
                                        relacionados a hardware, software e
                                        rede, garantindo a continuidade dos
                                        serviços.
                                    </li>
                                    <li>
                                        Manutenção e atualização do GCWEB,
                                        assegurando sua estabilidade, segurança
                                        e disponibilidade para os servidores da
                                        instituição.
                                    </li>
                                    <li>
                                        Apoio no desenvolvimento de novas
                                        funcionalidades, atuando no levantamento
                                        de requisitos, testes, documentação
                                        técnica e implementação de módulos.
                                    </li>
                                    <li>
                                        Participação ativa na migração do
                                        sistema: atualmente envolvido na
                                        transição do GCWEB de PHP com Yii 1.1
                                        para Laravel, com aprendizado prático em
                                        Laravel moderno, arquitetura limpa,
                                        padrões de projeto, segurança e
                                        organização de código.
                                    </li>
                                    <li>
                                        Utilização de tecnologias como{" "}
                                        <strong>PHP (Yii, Laravel)</strong>,{" "}
                                        <strong>Java</strong>,{" "}
                                        <strong>MySQL</strong>,{" "}
                                        <strong>Git</strong>, além de conceitos
                                        de desenvolvimento front-end e back-end
                                        para entregar soluções funcionais e
                                        integradas.
                                    </li>
                                </ul>
                                <p className="font-body text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Essa experiência tem sido essencial para meu
                                    crescimento técnico e profissional,
                                    especialmente por atuar em um sistema de
                                    abrangência nacional e alta relevância
                                    institucional.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                                            <Image
                                                src="/uninter-logo.png" // coloque o logo em public/uninter-logo.png
                                                alt="UNINTER"
                                                width={60}
                                                height={60}
                                                className="object-contain"
                                            />
                                        </div>
                                        <div>
                                            <CardTitle className="font-display text-xl mb-2">
                                                Estudante de Engenharia de
                                                Software
                                            </CardTitle>
                                            <CardDescription className="font-body flex flex-col gap-1 text-base">
                                                <span className="flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4" />
                                                    UNINTER Centro Universitário
                                                    Internacional
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    set de 2022 - set de 2026
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    Bacharelado · EAD
                                                </span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge className="font-body bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800">
                                        Em andamento
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="font-body text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                                    Formação focada em desenvolvimento de
                                    software, arquitetura de sistemas, bancos de
                                    dados, metodologias ágeis (Scrum, Kanban),
                                    computação em nuvem e qualidade de software.
                                </p>
                                <ul className="font-body text-slate-600 dark:text-slate-300 mb-2 list-disc list-inside space-y-1">
                                    <li>
                                        Desenvolvimento backend com Java, Spring
                                        Boot e APIs RESTful
                                    </li>
                                    <li>
                                        Bancos de dados relacionais (PostgreSQL,
                                        MySQL) e NoSQL (MongoDB)
                                    </li>
                                    <li>
                                        Engenharia de requisitos, análise e
                                        modelagem de sistemas
                                    </li>
                                    <li>
                                        Metodologias ágeis e testes de software
                                    </li>
                                    <li>Infraestrutura com Docker e AWS</li>
                                </ul>
                                <p className="font-body text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Reconhecido por desempenho consistente,
                                    dedicação e participação em projetos
                                    práticos simulando o mercado de trabalho.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projetos" className="py-12 md:py-24 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/50 mb-6">
                            <Code className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="font-body text-sm font-medium text-blue-700 dark:text-blue-300">
                                Meus trabalhos
                            </span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                            Projetos
                        </h2>
                        <p className="font-body text-xl text-slate-600 dark:text-slate-300">
                            Meus 12 melhores repositórios do GitHub
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {[...Array(12)].map((_, i) => (
                                <Card
                                    key={i}
                                    className="border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800"
                                >
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2 mb-4">
                                            <Skeleton className="h-6 w-16" />
                                            <Skeleton className="h-6 w-12" />
                                        </div>
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                                <ExternalLink className="h-8 w-8 text-red-600" />
                            </div>
                            <p className="font-body text-slate-600 dark:text-slate-300 mb-6 text-lg">
                                {error}
                            </p>
                            <Button
                                onClick={fetchGitHubRepos}
                                className="font-body bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                Tentar Novamente
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {repos.map((repo, index) => (
                                <Card
                                    key={repo.id}
                                    className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden cursor-pointer"
                                    onClick={() => handleCardClick(repo)}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    <CardHeader className="pb-4">
                                        <CardTitle className="font-display flex items-center justify-between text-lg">
                                            <span className="truncate font-semibold">
                                                {repo.name
                                                    .replace(/-/g, " ")
                                                    .replace(/\b\w/g, (l) =>
                                                        l.toUpperCase()
                                                    )}
                                            </span>
                                            <div className="flex gap-2 ml-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                    asChild
                                                >
                                                    <Link
                                                        href={repo.html_url}
                                                        target="_blank"
                                                    >
                                                        <Github className="h-6 w-6" />{" "}
                                                        {/* Ícone maior */}
                                                    </Link>
                                                </Button>
                                                {repo.homepage && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={repo.homepage}
                                                            target="_blank"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardTitle>
                                        <CardDescription className="font-body line-clamp-2 min-h-[2.5rem] text-slate-600 dark:text-slate-300">
                                            {repo.description ||
                                                "Sem descrição disponível"}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Topics/Tags */}
                                            {repo.topics &&
                                                repo.topics.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {repo.topics
                                                            .slice(0, 5)
                                                            .map((topic) => (
                                                                <Badge
                                                                    key={topic}
                                                                    variant="outline"
                                                                    className="font-body text-xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                                                >
                                                                    {topic}
                                                                </Badge>
                                                            ))}
                                                    </div>
                                                )}

                                            {/* Language and Stats */}
                                            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-4">
                                                    {repo.language && (
                                                        <div className="flex items-center gap-1">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        getLanguageColor(
                                                                            repo.language
                                                                        ),
                                                                }}
                                                            />
                                                            <span className="font-body font-medium">
                                                                {repo.language}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {repo.stargazers_count >
                                                        0 && (
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            <span className="font-body">
                                                                {
                                                                    repo.stargazers_count
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {repo.forks_count > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <GitFork className="h-3 w-3" />
                                                            <span className="font-body">
                                                                {
                                                                    repo.forks_count
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span className="font-body">
                                                        {formatDate(
                                                            repo.updated_at
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-16">
                        <Button
                            variant="outline"
                            size="lg"
                            className="font-body border-2 border-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 group bg-transparent"
                            asChild
                        >
                            <Link
                                href="https://github.com/gabriellglrs"
                                target="_blank"
                            >
                                <Github className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                Ver todos os repositórios
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section
                id="contato"
                className="py-12 md:py-24 px-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
            >
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/50 mb-6">
                            <Mail className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="font-body text-sm font-medium text-blue-700 dark:text-blue-300">
                                Entre em contato
                            </span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                            Vamos Conversar?
                        </h2>
                        <p className="font-body text-xl text-slate-600 dark:text-slate-300">
                            Estou sempre aberto a novas oportunidades e projetos
                            interessantes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-center">
                            <CardHeader>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4">
                                    <Mail className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="font-display">
                                    Email
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-body text-slate-600 dark:text-slate-300 mb-4">
                                    gabriellglrs@gmail.com
                                </p>
                                <Button
                                    className="font-body w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                                    asChild
                                >
                                    <Link href="mailto:gabriellglrs@gmail.com">
                                        Enviar Email
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 text-center">
                            <CardHeader>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl mx-auto mb-4">
                                    <Github className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="font-display">
                                    GitHub
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-body text-slate-600 dark:text-slate-300 mb-4">
                                    gabriellglrs
                                </p>
                                <Button
                                    className="font-body w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
                                    asChild
                                >
                                    <Link
                                        href="https://github.com/gabriellglrs"
                                        target="_blank"
                                    >
                                        Ver Perfil
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-center">
                            <CardHeader>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl mx-auto mb-4">
                                    <Linkedin className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="font-display">
                                    LinkedIn
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-body text-slate-600 dark:text-slate-300 mb-4">
                                    gabriellglrs
                                </p>
                                <Button
                                    className="font-body w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                                    asChild
                                >
                                    <Link
                                        href="https://www.linkedin.com/in/gabriellglrs/"
                                        target="_blank"
                                    >
                                        Conectar
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 text-center">
                            <CardHeader>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mx-auto mb-4">
                                    <Phone className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="font-display">
                                    WhatsApp
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-body text-slate-600 dark:text-slate-300 mb-4">
                                    38999705190
                                </p>
                                <Button
                                    className="font-body w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                    asChild
                                >
                                    <Link
                                        href="https://wa.me/5538999705190"
                                        target="_blank"
                                    >
                                        Enviar Mensagem
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 bg-white dark:bg-slate-950">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
                                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                    <Code className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <span className="font-display text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                                Gabriel Lucas
                            </span>
                        </div>
                        <p className="font-body text-sm text-slate-600 dark:text-slate-400">
                            © 2024 Desenvolvido com ❤️ usando Next.js e Tailwind
                            CSS
                        </p>
                    </div>
                </div>
            </footer>

            {/* Modal for README.md */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {modalRepo?.name}
                            <DialogClose className="absolute right-4 top-4" />
                        </DialogTitle>
                    </DialogHeader>
                    <div className="markdown-body prose dark:prose-invert max-w-none">
                        {readme ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                            >
                                {readme}
                            </ReactMarkdown>
                        ) : (
                            "Carregando..."
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
