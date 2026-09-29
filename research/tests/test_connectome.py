"""
Unit tests for Connectome data loading, graph analysis, and pruning.
"""

import pytest
import networkx as nx
import pandas as pd
from research.src.connectome_utils import ConnectomeData, ConnectomeAnalysis, prune_graph_by_weight_threshold


def test_connectome_data_fetch_neurons():
    data = ConnectomeData()
    neurons_df = data.fetch_all_neurons()
    assert isinstance(neurons_df, pd.DataFrame)
    assert not neurons_df.empty
    for col in ['body_id', 'type', 'roi', 'x', 'y', 'z']:
        assert col in neurons_df.columns
    assert len(neurons_df) > 500


def test_connectome_data_fetch_connectivity():
    data = ConnectomeData()
    conn_df = data.fetch_connectivity(min_synapses=5)
    assert isinstance(conn_df, pd.DataFrame)
    assert not conn_df.empty
    for col in ['pre_id', 'post_id', 'weight']:
        assert col in conn_df.columns
    assert (conn_df['weight'] >= 5).all()


def test_build_networkx_graph():
    data = ConnectomeData()
    conn_df = data.fetch_connectivity(min_synapses=5)
    graph = data.build_networkx_graph(conn_df)
    assert isinstance(graph, nx.DiGraph)
    assert graph.number_of_nodes() > 100
    assert graph.number_of_edges() > 100


def test_connectome_analysis():
    data = ConnectomeData()
    neurons = data.fetch_all_neurons()
    connectivity = data.fetch_connectivity(min_synapses=5)
    graph = data.build_networkx_graph(connectivity)

    analysis = ConnectomeAnalysis(graph, neurons)
    stats = analysis.print_statistics()
    assert 'nodes' in stats
    assert 'edges' in stats
    assert 'mean_in_degree' in stats
    assert stats['nodes'] == graph.number_of_nodes()

    motor = analysis.identify_motor_neurons()
    sensory = analysis.identify_sensory_neurons()
    assert isinstance(motor, pd.DataFrame)
    assert isinstance(sensory, pd.DataFrame)

    centrality = analysis.compute_centrality(metric='degree')
    assert 'body_id' in centrality.columns
    assert 'neuron_id' in centrality.columns
    assert 'centrality' in centrality.columns
    assert len(centrality) == graph.number_of_nodes()


def test_get_neurons_by_roi_signatures():
    data = ConnectomeData()
    neurons = data.fetch_all_neurons()

    # Signature 1: single argument (ROI name)
    cx_1 = data.get_neurons_by_roi('CX')
    assert isinstance(cx_1, pd.DataFrame)
    assert not cx_1.empty

    # Signature 2: two arguments (DataFrame, ROI name)
    cx_2 = data.get_neurons_by_roi(neurons, 'CX')
    assert isinstance(cx_2, pd.DataFrame)
    assert not cx_2.empty
    assert len(cx_1) == len(cx_2)


def test_prune_graph_by_weight_threshold():
    data = ConnectomeData()
    connectivity = data.fetch_connectivity(min_synapses=5)
    graph = data.build_networkx_graph(connectivity)
    initial_edges = graph.number_of_edges()

    pruned_50 = prune_graph_by_weight_threshold(graph, percentile=50)
    assert pruned_50.number_of_edges() < initial_edges
    assert abs(pruned_50.number_of_edges() - (initial_edges // 2)) <= 2

    pruned_90 = prune_graph_by_weight_threshold(graph, percentile=10)
    assert pruned_90.number_of_edges() < pruned_50.number_of_edges()
