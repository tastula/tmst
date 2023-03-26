import matplotlib.pyplot as plt
import numpy as np
import sys


def init_dockerdata():
    return {
        "cpu": [],
        "mem": [],
        "mem_abs": [],
        "pid": [],
    }


def read_statline(stats, line):
    # CPU percentage
    stat_cpu = float(line[1].split("%")[0])
    stats["cpu"].append(stat_cpu)
    # MEM percentage
    stat_mem = float(line[2].split("%")[0])
    stats["mem"].append(stat_mem)
    # MEM amount
    stat_mem = float(line[3].split("MiB")[0])
    stats["mem_abs"].append(stat_mem)
    # PID amount
    stat_pid = int(line[6])
    stats["pid"].append(stat_pid)


def read_statdata(filename, name_backend, name_database):
    stats_backend = init_dockerdata()
    stats_database = init_dockerdata()

    with open(filename, "r") as dockerdata:
        for statline in dockerdata.readlines():
            statline = statline.split(";")
            if statline[0] == name_backend:
                read_statline(stats_backend, statline)
            elif statline[0] == name_database:
                read_statline(stats_database, statline)

    return stats_backend, stats_database


def smoothen(stat, mins=3):
    # Sampling time is about 12 seconds => 5 samples make a minute
    sample_row = 5*mins
    # Some samples have to be left out for reshaping to work
    sample_start = len(stat) % sample_row

    stat_reshaped = np.reshape(np.array(stat[sample_start:]), (-1, sample_row))
    stat_averaged = np.average(stat_reshaped, axis=1, keepdims=True)
    print(np.average(stat_averaged))

    return stat_averaged


def plot_graph(info, ax):
    ax.set(xlabel=info["xlab"], ylabel=info["ylab"])

    for data in info["data"]:
        y = data[0]
        x = np.linspace(0, 12, len(y))
        ax.plot(x, y, label=data[1])

    ax.legend()


def plot_figure(title, infos):
    fig, axs = plt.subplots(len(infos))
    fig.suptitle(title)
    fig.set_size_inches(12, 8)

    for idx, info in enumerate(infos):
        plot_graph(info, axs[idx])

    plt.subplots_adjust(
        left=0.06,
        bottom=0.08,
        right=0.98,
        top=0.92
    )
    plt.show()


def plot_service(data, service):
    dockerstats_cpu = data["cpu"]
    dockerstats_mem = data["mem"]
    plot_figure(f"Resurssien käyttö ({service})",  [
        {
            "data": [
                [dockerstats_cpu, "CPU"],
                [smoothen(dockerstats_cpu), "CPU ka."]
            ],
            "xlab": "Aika aloitushetkestä (h)",
            "ylab": "Kulutus (%)"
        },
        {
            "data": [
                [dockerstats_mem, "MEM"],
                [smoothen(dockerstats_mem), "MEM ka."]
            ],
            "xlab": "Aika aloitushetkestä (h)",
            "ylab": "Kulutus (%)"
        }
    ])


if __name__ == "__main__":
    data_backend, data_database = read_statdata(
        sys.argv[1],
        sys.argv[2],
        sys.argv[3],
    )

    service_id = sys.argv[4]
    plot_service(data_backend, f"{service_id} palvelin")
    plot_service(data_database, f"{service_id} tietokanta")
