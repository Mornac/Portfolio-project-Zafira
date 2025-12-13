'use client';

import React, {useState, useEffect} from 'react';
import AdminCard from './admin-card';
import AdminActivityCard from './admin-activity-card';
import NavDashboard from '@/components/uiStyled/nav-dashboard';
import {Eye, TrendingUp, Users, MessageSquare, FileText} from 'lucide-react';
import {getStats, getTotalUsers} from '@/lib/api/stats';
import {getRecentActivities, ActivityDto} from '@/lib/api/activity';
import {Button} from '@/components/uiStyled/button';


export default function AdminDashboard() {
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState({
    daily: 0,
    monthly: 0,
    global: 0,
    users: 0,
  });
const [limit, setLimit] = useState(3); 
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Récupérer les 3 dernières activités
        const recentActivities: ActivityDto[] = await getRecentActivities(limit);

        const mappedActivities = recentActivities.map((act) => {
          let icon, typeLabel, description;

          switch (act.type) {
            case 'USER_REGISTERED':
              icon = <Users />;
              typeLabel = 'Bénéficiaire';
              description = act.title;
              break;
            case 'TESTIMONIAL_SUBMITTED':
              icon = <MessageSquare />;
              typeLabel = 'Témoignage';
              description = act.title;
              break;
            case 'BLOG_PUBLISHED':
              icon = <FileText />;
              typeLabel = 'Blog';
              description = act.title;
              break;
            case 'PARTNER_ADDED':
              icon = <Users />;
              typeLabel = 'Partenaire';
              description = act.title;
              break;
            case 'ACTION_PUBLISHED':
              icon = <TrendingUp />;
              typeLabel = 'Action';
              description = act.title;
              break;
            default:
              icon = <FileText />;
              typeLabel = 'Autre';
              description = act.title ?? 'Nouvelle activité';
          }

          return {
            id: act.id,
            icon,
            type: typeLabel,
            description,
            time: new Date(act.createdAt),
          };
        });

        setActivities(mappedActivities);

        // Fetch stats
        const [statRes, usersRes] = await Promise.all([
          getStats(),
          getTotalUsers(),
        ]);
        setStats({
          daily: statRes.daily,
          monthly: statRes.monthly,
          global: statRes.global,
          users: usersRes?.totalUsers ?? 0,
        });
      } catch (err) {
        console.error(
          'Erreur lors de la récupération des données du dashboard',
          err
        );
      }
    }

    fetchDashboardData();
  }, [limit]);

  const getTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-12">
      <NavDashboard />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard
          icon={<Eye />}
          label="Visiteurs aujourd'hui"
          value={stats.daily}
        />
        <AdminCard
          icon={<TrendingUp />}
          label="Visiteurs ce mois"
          value={stats.monthly}
        />
        <AdminCard
          icon={<TrendingUp />}
          label="Total visiteurs"
          value={stats.global}
        />
        <AdminCard
          icon={<Users />}
          label="Bénéficiaires inscrits"
          value={stats.users}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Activités récentes</h2>
        <div className="space-y-3 bg-bg">
          {activities.map((activity) => (
            <AdminActivityCard
              key={activity.id}
              icon={activity.icon}
              description={activity.description}
              timeAgo={getTimeAgo(activity.time)}
            />
          ))}
        </div>
        <div className="mt-4 text-center">
          {limit === 3 ? (
            <Button variant="bleu" size="lg" onClick={() => setLimit(100)}>
              Voir tout
            </Button>
          ) : (
            <Button variant="bleu" size="lg" onClick={() => setLimit(3)}>
              Réduire
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
