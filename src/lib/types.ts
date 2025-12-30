export interface Registration {
  id: number;
  fullName: string;
  email: string;
  classe: string;
  createdAt: string;
}

export interface ResultEntry {
  id: number;
  teamName: string;
  projectName: string;
  position: 1 | 2 | 3;
}
