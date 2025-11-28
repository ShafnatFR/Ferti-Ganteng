
export interface LogEntry {
    date: string;
    title: string;
    description: string;
    type: 'info' | 'warning' | 'success';
}

export interface Bin {
    id: number;
    name: string;
    status: string;
    phase: string;
    day: number;
    estHarvest: number;
    logs: LogEntry[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface ChatSession {
    id: string;
    title: string;
    date: string;
    isPinned?: boolean; // Added property
    messages: ChatMessage[];
}

export interface AIAnalysisResult {
    is_waste: boolean;
    items: string[];
    is_edible: boolean;
    ratio: number;
    advice: string;
}
