export interface Tournament {
  id: number | null;
  name: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface Player {
  id: number;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
}

export interface Team {
  name: string;
  role: "L" | "D";
  players: string[];
}

export interface Game {
  datetime: string;
  result: "L" | "D" | "T" | null;
  is_finished: boolean;
  bonus: boolean;
  teams: Team[];
}

export interface TableRow {
  player: Player;
  total_points: number;
  games_played: number;
  games_won: number;
  games_lost: number;
  games_tied: number;
  games_with_bonus: number;
}

export interface Selected {
  tournament: Tournament;
  games: Game[];
  table: TableRow[]
}



// Define la forma del contexto
export interface ContextData {
  tournaments: Tournament[];
  selected: Selected;
}

